package coraythan.keyswap.decks

import com.fasterxml.jackson.databind.ObjectMapper
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardIds
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.models.*
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import coraythan.keyswap.thirdpartyservices.keyforgeApiDeckPageSize
import coraythan.keyswap.userdeck.UserDeck
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.EntityManager
import kotlin.math.absoluteValue
import kotlin.math.roundToInt
import kotlin.system.measureTimeMillis

private const val lockImportNewDecksFor = "PT10M"
private const val lockUpdateRatings = "PT1S"
private const val lockUpdateCleanUnregistered = "PT24H"
private const val onceEverySixHoursLock = "PT6h"

const val currentDeckRatingVersion = 5

@Transactional
@Service
class DeckImporterService(
        private val keyforgeApi: KeyforgeApi,
        private val cardService: CardService,
        private val deckSynergyService: DeckSynergyService,
        private val deckService: DeckService,
        private val deckRepo: DeckRepo,
        private val deckPageService: DeckPageService,
        private val currentUserService: CurrentUserService,
        private val userDeckRepo: UserDeckRepo,
        private val objectMapper: ObjectMapper,
        entityManager: EntityManager
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private val query = JPAQueryFactory(entityManager)

    @Scheduled(fixedDelayString = lockImportNewDecksFor)
    @SchedulerLock(name = "importNewDecks", lockAtLeastForString = lockImportNewDecksFor, lockAtMostForString = lockImportNewDecksFor)
    fun importNewDecks() {
        val deckCountBeforeImport = deckRepo.count()
        val importDecksDuration = measureTimeMillis {
            val decksPerPage = keyforgeApiDeckPageSize
            var currentPage = deckPageService.findCurrentPage()

            val finalPage = currentPage + decksPerPage

            val maxPageRequests = 11
            var pagesRequested = 0
            while (currentPage < finalPage && pagesRequested < maxPageRequests) {
                val decks = keyforgeApi.findDecks(currentPage)
                if (decks == null) {
                    log.debug("Got null decks from the api for page $currentPage decks per page $decksPerPage")
                    break
                } else {
                    val cards = cardService.importNewCards(decks.data)
                    saveDecks(decks.data, cards)
                    currentPage++
                    pagesRequested++
                }
            }

            deckPageService.setCurrentPage(currentPage - 1)
        }
        val deckCountNow = deckRepo.count()
        log.info("Added ${deckCountNow - deckCountBeforeImport} decks. Total decks: $deckCountNow. It took ${importDecksDuration / 1000} seconds.")
        deckService.clearCachedValues()
        deckService.countFilters(DeckFilters())
    }

    @Scheduled(fixedDelayString = onceEverySixHoursLock)
    @SchedulerLock(name = "lockUpdateCleanUnregistered", lockAtLeastForString = lockUpdateCleanUnregistered, lockAtMostForString = lockUpdateCleanUnregistered)
    fun cleanOutUnregisteredDecks() {
        var unregDeckCount = 0
        var cleanedOut = 0
        val msToCleanUnreg = measureTimeMillis {
            val allUnregDecks = deckRepo.findAllByRegisteredFalse()
            unregDeckCount = allUnregDecks.size
            allUnregDecks.forEach { unreg ->
                val decksLike = deckRepo.findByNameIgnoreCase(unreg.name)
                        .filter { it.id != unreg.id }
                if (decksLike.isNotEmpty()) {
                    log.info("Deleting unreg deck with name ${unreg.name} id ${unreg.keyforgeId} because it matches deck ${decksLike[0].keyforgeId}")
                    deckRepo.deleteById(unreg.id)
                    cleanedOut++
                }
            }
        }

        log.info("Cleaned unregistered decks. Pre-existing total: $unregDeckCount cleaned out: $cleanedOut seconds taken: ${msToCleanUnreg / 1000}")
    }

    private var doneRatingDecks = false

    // Comment this in whenever rating gets revved
    @Scheduled(fixedDelayString = lockUpdateRatings)
    fun rateDecks() {

        if (doneRatingDecks) return

        val millisTaken = measureTimeMillis {
            val deckQ = QDeck.deck

            val deckResults = query.selectFrom(deckQ)
                    .where(deckQ.ratingVersion.ne(currentDeckRatingVersion).or(deckQ.ratingVersion.isNull))
                    .limit(10000)
                    .fetch()

            if (deckResults.isEmpty()) {
                doneRatingDecks = true
                log.info("Done rating decks!")
            }

            val rated = deckResults.map { rateDeck(it).copy(ratingVersion = currentDeckRatingVersion) }
            deckRepo.saveAll(rated)
        }

        log.info("Took $millisTaken ms to rate 10000 decks.")
    }

    // Non repeatable functions

    fun importDeck(deckId: String): Long? {
        val preExistingDeck = deckRepo.findByKeyforgeId(deckId)
        if (preExistingDeck != null) {
            return preExistingDeck.id
        } else {
            val deck = keyforgeApi.findDeck(deckId)
            if (deck != null) {
                val deckList = listOf(deck.data.copy(cards = deck.data._links?.cards))
                val cards = cardService.importNewCards(deckList)
                try {
                    saveDecks(deckList, cards)
                } catch (e: DataIntegrityViolationException) {
                    // We must have a pre-existing deck now
                    return deckRepo.findByKeyforgeId(deckId)?.id
                }
                return deckRepo.findByKeyforgeId(deckId)?.id
            }
        }
        return null
    }

    fun addUnregisteredDeck(
            unregisteredDeck: SaveUnregisteredDeck,
            currentUser: KeyUser? = null
    ): String {

        val user = currentUser ?: currentUserService.loggedInUser() ?: throw BadRequestException("Must be logged in to save unregistered deck.")

        val cardsAsList = unregisteredDeck.cards.values.flatten()

        log.info("Checking dups of unregistered deck.")
        val dup = deckService.findByNameIgnoreCase(unregisteredDeck.name.toLowerCase())
        if (dup.isNotEmpty()) {
            // This string is used in the front end, so don't change it!
            throw BadRequestException("Duplicate deck name ${unregisteredDeck.name}")
        }

        val cards = cardsAsList.map {
            val cards = cardService.findByExpansionCardNumberHouse(it.expansion, it.cardNumber, it.house)
            if (cards.isEmpty()) {
                throw BadRequestException("There is no card with expansion ${it.expansion} number ${it.cardNumber} and house ${it.house}")
            }
            cards[0]
        }
        val deck = Deck(
                keyforgeId = UUID.randomUUID().toString(),
                name = unregisteredDeck.name,
                expansion = cardsAsList[0].expansion,
                registered = false
        )

        val savedDeck = saveDeck(deck, unregisteredDeck.cards.keys.toList(), cards)
        val userDeck = UserDeck(user, savedDeck, creator = true)
        userDeckRepo.save(userDeck)
        log.info("Added unregistered deck with name ${savedDeck.name} fake id ${savedDeck.keyforgeId}")
        return savedDeck.keyforgeId
    }

    private fun saveDecks(deck: List<KeyforgeDeck>, cardsForDecks: List<Card>) {
        val cardsById: Map<String, Card> = cardsForDecks.associate { it.id to it }
        deck
                .mapNotNull { if (deckRepo.findByKeyforgeId(it.id) == null) it else null }
                .forEach { keyforgeDeck ->

                    val cardsList = keyforgeDeck.cards?.map { cardsById.getValue(it) } ?: listOf()
                    val houses = keyforgeDeck._links?.houses ?: throw java.lang.IllegalStateException("Deck didn't have houses.")
                    val deckToSave = keyforgeDeck.toDeck()

                    saveDeck(deckToSave, houses, cardsList)
                }
    }

    private fun saveDeck(deck: Deck, houses: List<House>, cardsList: List<Card>): Deck {
        val savedDeck = deckRepo.save(deck)

        if (houses.size != 3) {
            throw IllegalStateException("Deck doesn't have 3 houses! $deck")
        }
        if (cardsList.size != 36) {
            throw IllegalStateException("Can't have a deck without 36 cards deck: $deck")
        }

        val saveable = savedDeck
                .withCards(cardsList)
                .copy(
                        houses = houses,
                        cardIds = objectMapper.writeValueAsString(CardIds.fromCards(cardsList))
                )

        val ratedDeck = rateDeck(saveable)

        if (ratedDeck.cardIds.isBlank()) {
            throw IllegalStateException("Can't save a deck without its card ids: $deck")
        }

        return deckRepo.save(ratedDeck)
    }

    private fun rateDeck(deck: Deck): Deck {
        val cards = cardService.cardsForDeck(deck)
        val extraCardInfos = cards.map { it.extraCardInfo!! }
        val deckSynergyInfo = deckSynergyService.fromDeck(deck)
        val cardsRating = extraCardInfos.map { it.rating - 1 }.sum()
        val synergy = deckSynergyInfo.synergyRating.roundToInt()
        val antisynergy = deckSynergyInfo.antisynergyRating.roundToInt()
        val a = extraCardInfos.map { it.amberControl }.sum()
        val e = extraCardInfos.map { it.expectedAmber }.sum()
        val r = extraCardInfos.map { it.artifactControl }.sum()
        val c = extraCardInfos.map { it.creatureControl }.sum()
        val d = extraCardInfos.map { it.deckManipulation }.sum()
        val p = cards.map { it.effectivePower }.sum()
        val powerValue = (p.toDouble() / 5).roundToInt().toDouble() / 2
        return deck.copy(

                creatureCount = cards.filter { it.cardType == CardType.Creature }.size,
                actionCount = cards.filter { it.cardType == CardType.Action }.size,
                artifactCount = cards.filter { it.cardType == CardType.Artifact }.size,
                upgradeCount = cards.filter { it.cardType == CardType.Upgrade }.size,

                amberControl = a,
                expectedAmber = e,
                artifactControl = r,
                creatureControl = c,
                deckManipulation = d,
                effectivePower = p,
                aercScore = a + e + r + c + d + powerValue,
                sasRating = cardsRating.roundToInt() + synergy + antisynergy,
                cardsRating = cardsRating.roundToInt(),
                synergyRating = synergy,
                antisynergyRating = antisynergy.absoluteValue
        )
    }

}
