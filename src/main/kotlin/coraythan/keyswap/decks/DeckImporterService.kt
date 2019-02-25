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
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.stats.incrementValue
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import coraythan.keyswap.thirdpartyservices.keyforgeApiDeckPageSize
import coraythan.keyswap.userdeck.UserDeck
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
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
private const val lockUpdateStats = "PT72H"

const val currentDeckRatingVersion = 3

@Transactional
@Service
class DeckImporterService(
        private val keyforgeApi: KeyforgeApi,
        private val cardService: CardService,
        private val deckSynergyService: DeckSynergyService,
        private val deckService: DeckService,
        private val deckRepo: DeckRepo,
        private val deckPageService: DeckPageService,
        private val statsService: StatsService,
        private val currentUserService: CurrentUserService,
        private val userDeckRepo: UserDeckRepo,
        private val objectMapper: ObjectMapper,
        entityManager: EntityManager
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private val query = JPAQueryFactory(entityManager)

    @Scheduled(fixedRateString = lockImportNewDecksFor)
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

    @Scheduled(fixedRateString = onceEverySixHoursLock)
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

    @Scheduled(fixedRateString = "PT24H")
    @SchedulerLock(name = "updateStatistics", lockAtLeastForString = lockUpdateStats, lockAtMostForString = lockUpdateStats)
    fun updateDeckStats() {
        log.info("Began update to deck statistics.")
        // Only update them if we have a few decks in the DB
        if (deckPageService.findCurrentPage() > 100) {
            updateDeckStatisticsPrivate()
        }
        log.info("Updated deck statistics.")
    }

    private var doneRatingDecks = false

    @Scheduled(fixedRateString = lockUpdateRatings)
    fun rateDecks() {

        if (doneRatingDecks) return

        val millisTaken = measureTimeMillis {
            val deckQ = QDeck.deck

            val deckResults = query.selectFrom(deckQ)
                    .where(deckQ.ratingVersion.ne(currentDeckRatingVersion))
                    .limit(10000)
                    .fetch()

            if (deckResults.isEmpty()) {
                doneRatingDecks = true
                log.info("Done rating decks!")
                updateDeckStats()
            }

            val rated = deckResults.map { rateDeck(it).copy(ratingVersion = currentDeckRatingVersion) }
            deckRepo.saveAll(rated)
        }

        log.info("Took $millisTaken ms to rate 10000 decks.")
    }

    // Non repeatable functions

    fun importDeck(deckId: String): Boolean {
        val preExistingDeck = deckRepo.findByKeyforgeId(deckId)
        if (preExistingDeck != null) {
            return true
        } else {
            val deck = keyforgeApi.findDeck(deckId)
            if (deck != null) {
                val deckList = listOf(deck.data.copy(cards = deck.data._links?.cards))
                val cards = cardService.importNewCards(deckList)
                saveDecks(deckList, cards)
                return true
            }
        }
        return false
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

    // private functions

    private fun updateDeckStatisticsPrivate() {
        val armorValues: MutableMap<Int, Int> = mutableMapOf()
        val totalCreaturePower: MutableMap<Int, Int> = mutableMapOf()
        val expectedAmber: MutableMap<Int, Int> = mutableMapOf()
        val amberControl: MutableMap<Int, Int> = mutableMapOf()
        val creatureControl: MutableMap<Int, Int> = mutableMapOf()
        val artifactControl: MutableMap<Int, Int> = mutableMapOf()
        val sasRating: MutableMap<Int, Int> = mutableMapOf()
        val cardsRating: MutableMap<Int, Int> = mutableMapOf()
        val synergy: MutableMap<Int, Int> = mutableMapOf()
        val antisynergy: MutableMap<Int, Int> = mutableMapOf()
        val creatureCount: MutableMap<Int, Int> = mutableMapOf()
        val actionCount: MutableMap<Int, Int> = mutableMapOf()
        val artifactCount: MutableMap<Int, Int> = mutableMapOf()
        val equipmentCount: MutableMap<Int, Int> = mutableMapOf()
        val power2OrLower: MutableMap<Int, Int> = mutableMapOf()
        val power3OrLower: MutableMap<Int, Int> = mutableMapOf()
        val power3OrHigher: MutableMap<Int, Int> = mutableMapOf()
        val power4OrHigher: MutableMap<Int, Int> = mutableMapOf()
        val power5OrHigher: MutableMap<Int, Int> = mutableMapOf()

        val sasToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val cardRatingsToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val synergyToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val antisynergyToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val amberControlToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val expectedAmberToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val artifactControlToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()
        val creatureControlToWinsLosses: MutableMap<Int, Wins> = mutableMapOf()

        val creatureWins = mutableMapOf<Int, Wins>()
        val actionWins = mutableMapOf<Int, Wins>()
        val artifactWins = mutableMapOf<Int, Wins>()
        val upgradeWins = mutableMapOf<Int, Wins>()

        val raresWins = mutableMapOf<Int, Wins>()
        val houseWins = mutableMapOf<House, Wins>()

        var currentPage = 0L
        val pageSize = 1000L
        var msToQuery = 0L
        var msToIncMaps = 0L
        val deckQ = QDeck.deck
        while (true) {

            var results: List<Deck> = listOf()

            val queryMs = measureTimeMillis {

                results = query.selectFrom(deckQ)
                        .where(deckQ.registered.isTrue)
                        .limit(pageSize)
                        .offset(currentPage * pageSize)
                        .orderBy(deckQ.id.asc())
                        .fetch()

            }

            msToQuery += queryMs

            if (results.isEmpty()) {
                break
            }

            val addToMapMs = measureTimeMillis {
                results.forEach {
                    val cards = cardService.cardsForDeck(it)
                    val ratedDeck = it

                    armorValues.incrementValue(ratedDeck.totalArmor)
                    totalCreaturePower.incrementValue(ratedDeck.totalPower)
                    expectedAmber.incrementValue(ratedDeck.expectedAmber.roundToInt())
                    amberControl.incrementValue(ratedDeck.amberControl.roundToInt())
                    creatureControl.incrementValue(ratedDeck.creatureControl.roundToInt())
                    artifactControl.incrementValue(ratedDeck.artifactControl.roundToInt())
                    sasRating.incrementValue(ratedDeck.sasRating)
                    cardsRating.incrementValue(ratedDeck.cardsRating)
                    synergy.incrementValue(ratedDeck.synergyRating)
                    antisynergy.incrementValue(ratedDeck.antisynergyRating)
                    creatureCount.incrementValue(ratedDeck.totalCreatures)
                    actionCount.incrementValue(ratedDeck.totalActions)
                    artifactCount.incrementValue(ratedDeck.totalArtifacts)
                    equipmentCount.incrementValue(ratedDeck.totalUpgrades)

                    val creatureCards = cards.filter { card -> card.cardType == CardType.Creature }

                    power2OrLower.incrementValue(creatureCards.filter { card -> card.power < 3 }.size)
                    power3OrLower.incrementValue(creatureCards.filter { card -> card.power < 4 }.size)
                    power3OrHigher.incrementValue(creatureCards.filter { card -> card.power > 2 }.size)
                    power4OrHigher.incrementValue(creatureCards.filter { card -> card.power > 3 }.size)
                    power5OrHigher.incrementValue(creatureCards.filter { card -> card.power > 4 }.size)

                    if (it.wins != 0 || it.losses != 0) {
                        val wins = Wins(it.wins, it.losses)
                        sasToWinsLosses.addWinsLosses(it.sasRating, wins)
                        cardRatingsToWinsLosses.addWinsLosses(it.cardsRating, wins)
                        synergyToWinsLosses.addWinsLosses(it.synergyRating, wins)
                        antisynergyToWinsLosses.addWinsLosses(it.antisynergyRating, wins)
                        amberControlToWinsLosses.addWinsLosses(it.amberControl.roundToInt(), wins)
                        expectedAmberToWinsLosses.addWinsLosses(it.expectedAmber.roundToInt(), wins)
                        artifactControlToWinsLosses.addWinsLosses(it.artifactControl.roundToInt(), wins)
                        creatureControlToWinsLosses.addWinsLosses(it.creatureControl.roundToInt(), wins)

                        creatureWins.addWinsLosses(it.totalCreatures, wins)
                        actionWins.addWinsLosses(it.totalActions, wins)
                        artifactWins.addWinsLosses(it.totalArtifacts, wins)
                        upgradeWins.addWinsLosses(it.totalUpgrades, wins)

                        raresWins.addWinsLosses(it.raresCount, wins)
                        it.houses.forEach { house ->
                            houseWins.addWinsLosses(house, wins)
                        }
                    }
                }
            }
            msToIncMaps += addToMapMs
            currentPage++

            if (currentPage.toInt() % 100 == 0) {
                log.info("Updating stats, currently on deck ${currentPage * pageSize} sec ToQuery ${msToQuery / 1000} sec ToIncMap ${msToIncMaps / 1000}")
            }
        }
        val deckStatistics = DeckStatistics(
                armorValues = armorValues,
                totalCreaturePower = totalCreaturePower,
                expectedAmber = expectedAmber,
                amberControl = amberControl,
                creatureControl = creatureControl,
                artifactControl = artifactControl,
                sas = sasRating,
                cardsRating = cardsRating,
                synergy = synergy,
                antisynergy = antisynergy,
                creatureCount = creatureCount,
                actionCount = actionCount,
                artifactCount = artifactCount,
                upgradeCount = equipmentCount,
                power2OrLower = power2OrLower,
                power3OrLower = power3OrLower,
                power3OrHigher = power3OrHigher,
                power4OrHigher = power4OrHigher,
                power5OrHigher = power5OrHigher,

                sasToWinsLosses = sasToWinsLosses,
                cardRatingsToWinsLosses = cardRatingsToWinsLosses,
                synergyToWinsLosses = synergyToWinsLosses,
                antisynergyToWinsLosses = antisynergyToWinsLosses,
                amberControlToWinsLosses = amberControlToWinsLosses,
                expectedAmberToWinsLosses = expectedAmberToWinsLosses,
                artifactControlToWinsLosses = artifactControlToWinsLosses,
                creatureControlToWinsLosses = creatureControlToWinsLosses,

                creatureWins = creatureWins,
                actionWins = actionWins,
                artifactWins = artifactWins,
                upgradeWins = upgradeWins,

                raresWins = raresWins,
                housesWins = houseWins
        )
        statsService.setStats(deckStatistics)
        log.info(
                "Deck stats:\n" +
                        "sas stats: ${deckStatistics.sasStats}\n" +
                        "cards rating: ${deckStatistics.cardsRatingStats}\n" +
                        "synergy: ${deckStatistics.synergyStats}\n" +
                        "antisynergy: ${deckStatistics.antisynergyStats}\n" +
                        "sas win rate: ${deckStatistics.sasToWinsLosses}"
        )
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
        return deck.copy(

                totalCreatures = cards.filter { it.cardType == CardType.Creature }.size,
                totalActions = cards.filter { it.cardType == CardType.Action }.size,
                totalArtifacts = cards.filter { it.cardType == CardType.Artifact }.size,
                totalUpgrades = cards.filter { it.cardType == CardType.Upgrade }.size,

                expectedAmber = extraCardInfos.map { it.expectedAmber }.sum(),
                amberControl = extraCardInfos.map { it.amberControl }.sum(),
                creatureControl = extraCardInfos.map { it.creatureControl }.sum(),
                artifactControl = extraCardInfos.map { it.artifactControl }.sum(),
                sasRating = cardsRating.roundToInt() + synergy + antisynergy,
                cardsRating = cardsRating.roundToInt(),
                synergyRating = synergy,
                antisynergyRating = antisynergy.absoluteValue
        )
    }

}
