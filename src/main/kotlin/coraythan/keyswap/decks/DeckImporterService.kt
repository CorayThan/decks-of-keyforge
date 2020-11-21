package coraythan.keyswap.decks

import com.fasterxml.jackson.databind.ObjectMapper
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.House
import coraythan.keyswap.cards.*
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.Env
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.models.*
import coraythan.keyswap.expansions.activeExpansions
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.thirdpartyservices.KeyforgeApi
import coraythan.keyswap.thirdpartyservices.keyforgeApiDeckPageSize
import org.hibernate.exception.ConstraintViolationException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.HttpClientErrorException
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.EntityManager
import kotlin.math.absoluteValue
import kotlin.system.measureTimeMillis

private const val lockImportNewDecksFor = "PT2M"
private const val lockUpdateRatings = "PT10S"

var deckImportingUpToDate = false

@Transactional
@Service
class DeckImporterService(
        private val keyforgeApi: KeyforgeApi,
        private val cardService: CardService,
        private val deckSearchService: DeckSearchService,
        private val deckRepo: DeckRepo,
        private val deckPageService: DeckPageService,
        private val deckRatingProgressService: DeckRatingProgressService,
        private val statsService: StatsService,
        private val objectMapper: ObjectMapper,
        private val cardRepo: CardRepo,
        @Value("\${env}")
        private val env: Env,
        val entityManager: EntityManager
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private val query = JPAQueryFactory(entityManager)

    @Transactional(propagation = Propagation.NEVER)
    @Scheduled(fixedDelayString = lockImportNewDecksFor, initialDelayString = SchedulingConfig.importNewDecksInitialDelay)
    // @SchedulerLock(name = "importNewDecks", lockAtLeastFor = lockImportNewDecksFor, lockAtMostFor = lockImportNewDecksFor)
    fun importNewDecks() {
        log.info("$scheduledStart new deck import.")

        val deckCountBeforeImport = deckRepo.estimateRowCount()

        deckImportingUpToDate = false
        var decksAdded = 0
        var pagesRequested = 0
        val importDecksDuration = measureTimeMillis {
            var currentPage = deckPageService.findCurrentPage()

            val maxPageRequests = 100
            while (pagesRequested < maxPageRequests) {
                if (pagesRequested != 0) Thread.sleep(3000)
                log.info("Importing decks, making page request $currentPage")
                try {
                    val decks = keyforgeApi.findDecks(currentPage, useMasterVault = true)
                    if (decks == null) {
                        deckImportingUpToDate = true
                        log.info("Got null decks from the api for page $currentPage decks per page $keyforgeApiDeckPageSize")
                        break
                    } else if (decks.data.any {
                                // Only import decks from these sets
                                !activeExpansions.map { expansion -> expansion.expansionNumber }.contains(it.expansion)
                            }) {

                        log.info("Stopping deck import. Unknown expansion number among ${decks.data.map { it.expansion }}")
                        break
                    } else {
                        cardService.importNewCards(decks.data)
                        val decksToSaveCount = decks.data.count()
                        decksAdded += saveDecks(decks.data, currentPage)
                        currentPage++
                        pagesRequested++

                        if (decksToSaveCount < keyforgeApiDeckPageSize) {
                            deckImportingUpToDate = true
                            log.info("Stopped getting decks, decks added $decksToSaveCount < $keyforgeApiDeckPageSize")
                            break
                        }
                    }
                } catch (e: HttpClientErrorException.TooManyRequests) {
                    log.warn("KeyForge API says we made too many requests. Sad day.")
                    break
                }
            }
        }
        val deckCountNow = deckRepo.count()
        log.info("$scheduledStop Added $decksAdded decks. Total decks: $deckCountNow. Decks added by counts ${deckCountNow - deckCountBeforeImport} " +
                "Pages requested $pagesRequested It took ${importDecksDuration / 1000} seconds.")
        deckSearchService.countFilters(DeckFilters())
    }

    // Rev publishAercVersion to rerate decks
    @Scheduled(fixedDelayString = lockUpdateRatings, initialDelayString = SchedulingConfig.rateDecksInitialDelay)
    fun rateDecks() {

        if (env == Env.qa) {
            log.info("QA environment, skip rating decks.")
            return
        }

        try {

            // If next page is null, we know we are done
            var nextDeckPage = deckRatingProgressService.nextPage() ?: return
            var quantFound = 0
            var quantRerated = 0

            log.info("$scheduledStart rate decks.")

            val maxToRate = DeckPageType.RATING.quantity * (if (env == Env.dev) 10 else 1)

            val millisTaken = measureTimeMillis {

                while (quantRerated < maxToRate && quantFound < 100000) {

                    // If next page is null, we know we are done
                    nextDeckPage = deckRatingProgressService.nextPage() ?: break

                    val deckResults = deckPageService.decksForPage(nextDeckPage, DeckPageType.RATING)
                    quantFound += deckResults.size

                    val deckQ = QDeck.deck
                    val mostRecentDeck = query.selectFrom(deckQ)
                            .orderBy(deckQ.id.desc())
                            .limit(1)
                            .fetch()
                            .first()

                    val idEndForPage = deckPageService.idEndForPage(nextDeckPage, DeckPageType.RATING)

                    val rated = deckResults.mapNotNull {
                        val rated = rateDeck(it, majorRevision).copy(lastUpdate = ZonedDateTime.now())
                        if (rated.ratingsEqual(it)) {
                            null
                        } else {
                            rated
                        }
                    }
                    quantRerated += rated.size
                    if (rated.isNotEmpty()) {
                        deckRepo.saveAll(rated)
                    }
                    deckRatingProgressService.revPage()

                    if (mostRecentDeck.id < idEndForPage) {
                        deckRatingProgressService.complete()
                        statsService.startNewDeckStats()
                        log.info("Done rating decks!")
                        break
                    }
                    log.info("Got next page, quant rerated $quantRerated found $quantFound max $maxToRate")
                }
            }

            log.info("$scheduledStop Took $millisTaken ms to rate decks. Page: $nextDeckPage Found: $quantFound Rerated: $quantRerated.")
        } catch (e: Throwable) {
            log.error("$scheduledException rating decks", e)
        }
    }

    fun importDeck(deckId: String): Long? {
        val preExistingDeck = deckRepo.findByKeyforgeId(deckId)
        if (preExistingDeck != null) {
            return preExistingDeck.id
        } else {
            val deck = keyforgeApi.findDeckToImport(deckId)
            if (deck != null) {
                val deckList = listOf(deck.data.copy(cards = deck.data._links?.cards))
                cardService.importNewCards(deckList)
                return try {
                    saveDecks(deckList)
                    deckRepo.findByKeyforgeId(deckId)?.id
                } catch (e: RuntimeException) {
                    if (e::class.java == DataIntegrityViolationException::class.java || e::class.java == ConstraintViolationException::class.java) {
                        // We must have a pre-existing deck now
                        log.info("Encountered exception saving deck to import, but it was just the deck already being saved")
                        deckRepo.findByKeyforgeId(deckId)?.id
                    } else {
                        throw e
                    }
                }
            }
        }
        return null
    }

    private fun makeBasicDeckFromDeckBuilderData(deckBuilderData: DeckBuildingData): Pair<Deck, List<Card>> {
        val cards = deckBuilderData.cards.flatMap { entry ->
            entry.value.map {
                val card: Card = cardService.findByExpansionCardName(deckBuilderData.expansion.expansionNumber, it.name, it.enhanced)
                        ?: cardService.findByCardName(it.name)
                        ?: throw BadRequestException("Couldn't find card with expansion ${deckBuilderData.expansion.expansionNumber} name $it and house ${entry.key}")

                card.copy(house = entry.key)
            }
        }
        return Deck(
                keyforgeId = UUID.randomUUID().toString(),
                name = deckBuilderData.name,
                expansion = deckBuilderData.expansion.expansionNumber,
        ) to cards
    }

    /**
     * Only set current page if this is auto importing new decks
     */
    @Transactional(propagation = Propagation.REQUIRED)
    fun saveDecks(deck: List<KeyforgeDeck>, currentPage: Int? = null): Int {
        var savedCount = 0
//        val cardsById: Map<String, Card> = cardsForDecks.associateBy { it.id }
        deck
                .forEach { keyforgeDeck ->
                    if (deckRepo.findByKeyforgeId(keyforgeDeck.id) == null) {
                        val cardsList = keyforgeDeck.cards?.map {
                            val dbCard = cardRepo.findByIdOrNull(it) ?: error("No card in repo for $it")
                            val cardServiceCard = cardService.findByCardName(dbCard.cardTitle) ?: error("No card in card service for ${dbCard.cardTitle}")
                            dbCard.extraCardInfo = cardServiceCard.extraCardInfo
                            dbCard
                        } ?: listOf()
                        val houses = keyforgeDeck._links?.houses?.mapNotNull { House.fromMasterVaultValue(it) }
                                ?: throw java.lang.IllegalStateException("Deck didn't have houses.")
                        check(houses.size == 3) { "Deck ${keyforgeDeck.id} doesn't have three houses!" }
                        check(cardsList.isNotEmpty()) { "Deck ${keyforgeDeck.id} doesn't have cards!" }
                        val deckToSave = keyforgeDeck.toDeck()

                        try {
                            saveDeck(deckToSave, houses, cardsList)
                            savedCount++
                        } catch (e: DataIntegrityViolationException) {
                            if (e.message?.contains("deck_keyforge_id_uk") == true) {
                                log.info("Ignoring unique key exception adding deck with id ${keyforgeDeck.id}.")
                            } else {
                                throw e
                            }
                        }
                    } else {
                        log.debug("Ignoring deck that already existed with id ${keyforgeDeck.id}")
                    }
                }
        if (currentPage != null && deck.count() >= keyforgeApiDeckPageSize) {
            val nextPage = currentPage + 1
            log.info("Updating next deck page to $nextPage")
            deckPageService.setCurrentPage(nextPage)
        }
        return savedCount
    }

    fun viewTheoreticalDeck(deck: DeckBuildingData): Deck {
        val deckAndCards = makeBasicDeckFromDeckBuilderData(deck)
        return validateAndRateDeck(deckAndCards.first, deck.cards.keys.toList(), deckAndCards.second)
    }

    private fun saveDeck(deck: Deck, houses: List<House>, cardsList: List<Card>): Deck {
        val ratedDeck = validateAndRateDeck(deck, houses, cardsList)
        return deckRepo.save(ratedDeck)
    }

    private fun validateAndRateDeck(deck: Deck, houses: List<House>, cardsList: List<Card>): Deck {
        check(houses.size == 3) { "Deck doesn't have 3 houses! $deck" }
        check(cardsList.size == 36) { "Can't have a deck without 36 cards deck: $deck" }

        val saveable = deck
                .withCards(cardsList)
                .copy(
                        houseNamesString = houses.sorted().joinToString("|"),
                        cardIds = objectMapper.writeValueAsString(CardIds.fromCards(cardsList))
                )

        val ratedDeck = rateDeck(saveable)

        check(!ratedDeck.cardIds.isBlank()) { "Can't save a deck without its card ids: $deck" }

        return ratedDeck
    }

    fun rateDeck(deck: Deck, majorRevision: Boolean = false): Deck {
        val cards = cardService.cardsForDeck(deck)
        val deckSynergyInfo = DeckSynergyService.fromDeckWithCards(deck, cards)
        val bonusDraw = cards.mapNotNull { it.extraCardInfo?.enhancementDraw }.sum()
        val bonusCapture = cards.mapNotNull { it.extraCardInfo?.enhancementCapture }.sum()
        return deck.copy(

                bonusDraw = if (bonusDraw == 0) null else bonusDraw,
                bonusCapture = if (bonusCapture == 0) null else bonusCapture,

                creatureCount = cards.filter { it.cardType == CardType.Creature }.size,
                actionCount = cards.filter { it.cardType == CardType.Action }.size,
                artifactCount = cards.filter { it.cardType == CardType.Artifact }.size,
                upgradeCount = cards.filter { it.cardType == CardType.Upgrade }.size,

                amberControl = deckSynergyInfo.amberControl,
                expectedAmber = deckSynergyInfo.expectedAmber,
                artifactControl = deckSynergyInfo.artifactControl,
                creatureControl = deckSynergyInfo.creatureControl,
                efficiency = deckSynergyInfo.efficiency,
                effectivePower = deckSynergyInfo.effectivePower,
                disruption = deckSynergyInfo.disruption,
                creatureProtection = deckSynergyInfo.creatureProtection,
                other = deckSynergyInfo.other,
                aercScore = deckSynergyInfo.rawAerc.toDouble(),
                sasRating = deckSynergyInfo.sasRating,
                previousSasRating = if (deckSynergyInfo.sasRating != deck.sasRating) deck.sasRating else deck.previousSasRating,
                previousMajorSasRating = if (majorRevision) deck.sasRating else deck.previousMajorSasRating,
                aercVersion = publishedAercVersion,
                synergyRating = deckSynergyInfo.synergyRating,
                antisynergyRating = deckSynergyInfo.antisynergyRating.absoluteValue
        )
    }
}
