package coraythan.keyswap.decks

import com.fasterxml.jackson.databind.ObjectMapper
import coraythan.keyswap.House
import coraythan.keyswap.cards.*
import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.Env
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckBuildingData
import coraythan.keyswap.decks.models.DeckSasValuesSearchable
import coraythan.keyswap.decks.models.DeckSasValuesUpdatable
import coraythan.keyswap.decks.pastsas.PastSasService
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.expansions.activeExpansions
import coraythan.keyswap.sasupdate.SasVersionService
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.synergy.DeckSynergyInfo
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import coraythan.keyswap.thirdpartyservices.mastervault.KeyForgeDeck
import coraythan.keyswap.thirdpartyservices.mastervault.KeyforgeApi
import coraythan.keyswap.thirdpartyservices.mastervault.keyforgeApiDeckPageSize
import org.hibernate.exception.ConstraintViolationException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.HttpClientErrorException
import java.util.*
import kotlin.system.measureTimeMillis

private const val lockImportNewDecksFor = "PT1M"

var deckImportingUpToDate = false

@Transactional
@Service
class DeckImporterService(
    private val keyforgeApi: KeyforgeApi,
    private val cardService: CardService,
    private val deckSearchService: DeckSearchService,
    private val deckRepo: DeckRepo,
    private val deckSasValuesSearchableRepo: DeckSasValuesSearchableRepo,
    private val deckSasValuesUpdatableRepo: DeckSasValuesUpdatableRepo,
    private val deckPageService: DeckPageService,
    private val statsService: StatsService,
    private val objectMapper: ObjectMapper,
    private val cardRepo: CardRepo,
    private val pastSasService: PastSasService,
    private val postProcessDecksService: PostProcessDecksService,
    private val dokCardCacheService: DokCardCacheService,
    private val sasVersionService: SasVersionService,
    @Value("\${env}")
    private val env: Env,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    @Transactional(propagation = Propagation.NEVER)
//    @Scheduled(
//        fixedDelayString = lockImportNewDecksFor,
//        initialDelayString = SchedulingConfig.importNewDecksInitialDelay
//    )
//    @SchedulerLock(
//        name = "importNewDecks",
//        lockAtLeastFor = lockImportNewDecksFor,
//        lockAtMostFor = lockImportNewDecksFor
//    )
    fun importNewDecks() {
        log.info("$scheduledStart new deck import.")

        // val deckCountBeforeImport = deckRepo.estimateRowCount()

        deckImportingUpToDate = false
        var decksAdded = 0
        var pagesRequested = 0
        val importDecksDuration = measureTimeMillis {
            var currentPage = deckPageService.findCurrentPage(DeckPageType.IMPORT)

            val maxPageRequests = 20
            while (pagesRequested < maxPageRequests) {
                if (pagesRequested != 0) Thread.sleep(3000)
                log.info("Importing decks, making page request $currentPage")
                try {
                    val decks = keyforgeApi.findDecks(currentPage, useMasterVault = false, withCards = true)
                    if (decks == null) {
                        deckImportingUpToDate = true
                        log.info("Got null decks from the api for page $currentPage decks per page $keyforgeApiDeckPageSize")
                        break
                    } else if (decks.data.any {
                            // Only import decks from these sets
                            // this.log.info("Active expansions is: ${activeExpansions.toString()}")
                            !activeExpansions.map { expansion ->
                                expansion.expansionNumber
                            }.contains(it.expansion)
                        }) {

                        log.info("Stopping deck import. Unknown expansion number among ${decks.data.map { it.expansion }}")
                        break
                    } else {

                        val decksToSaveCount = decks.data.count()

                        val results = saveDecks(decks.data, currentPage)

                        decksAdded += results
                        currentPage++
                        pagesRequested++

                        if (decksToSaveCount < keyforgeApiDeckPageSize || results < keyforgeApiDeckPageSize) {
                            deckImportingUpToDate = true
                            log.info(
                                "Stopped getting decks, decks to save was $decksToSaveCount, added was $results < $keyforgeApiDeckPageSize. Expansions: ${
                                    decks.data.map { it.toDeck().expansionEnum }.toSortedSet()
                                }"
                            )
                            break
                        }
                    }
                } catch (e: HttpClientErrorException.TooManyRequests) {
                    log.warn("KeyForge API says we made too many requests. Sad day." + e.message)
                    break
                }
            }
        }
        val deckCountNow = deckRepo.estimateRowCount()
        log.info(
            "$scheduledStop Added $decksAdded decks. Total decks: $deckCountNow.  " +
                    "Pages requested $pagesRequested It took ${importDecksDuration / 1000} seconds."
        )
        deckSearchService.countFilters(DeckFilters())
    }

    // Rev publishAercVersion to rerate decks
//    @Scheduled(fixedDelayString = lockUpdateRatings, initialDelayString = SchedulingConfig.rateDecksInitialDelay)
//    fun rateDecks() {
//
//        if (env == Env.qa) {
//            log.info("QA environment, skip rating decks.")
//            return
//        }
//
//        try {
//
//            // If next page is null, we know we are done
//            var nextDeckPage = deckRatingProgressService.nextPage() ?: return
//            var quantFound = 0
//            var quantRerated = 0
//
//            log.info("$scheduledStart rate decks.")
//
//            val maxToRate = DeckPageType.RATING.quantity * (if (env == Env.dev) 10 else 1)
//
//            val millisTaken = measureTimeMillis {
//
//                while (quantRerated < maxToRate && quantFound < 100000) {
//
//                    // If next page is null, we know we are done
//                    nextDeckPage = deckRatingProgressService.nextPage() ?: break
//
//                    val deckResults = deckPageService.decksForPage(nextDeckPage, DeckPageType.RATING, true)
//                    quantFound += deckResults.decks.size
//
//                    val rated: List<Pair<Deck, DeckSynergyInfo>> = deckResults.decks.mapNotNull {
//                        val deckSynergiesPair = rateDeck(it, publishedSasVersionService.majorVersion())
//                        val rated = deckSynergiesPair.first.copy(lastUpdate = ZonedDateTime.now())
//                        if (rated.ratingsEqual(it)) {
//                            null
//                        } else {
//                            Pair(rated, deckSynergiesPair.second)
//                        }
//                    }
//                    quantRerated += rated.size
//                    if (rated.isNotEmpty()) {
//                        deckRepo.saveAll(rated.map { it.first })
//                        pastSasService.createAll(rated)
//                    }
//                    deckRatingProgressService.revPage()
//
//                    if (!deckResults.moreResults) {
//                        deckRatingProgressService.complete()
//                        statsService.startNewDeckStats()
//                        log.info("Done rating decks!")
//                        break
//                    }
//                    log.info("Got next page, quant rerated $quantRerated found $quantFound max $maxToRate")
//                }
//            }
//
//            log.info("$scheduledStop Took $millisTaken ms to rate decks. Page: $nextDeckPage Found: $quantFound Rerated: $quantRerated.")
//        } catch (e: Throwable) {
//            log.error("$scheduledException rating decks", e)
//        }
//    }

    fun importDeck(deckId: String): Long? {
        val preExistingDeck = deckRepo.findByKeyforgeId(deckId)
        if (preExistingDeck != null) {
            return preExistingDeck.id
        } else {
            val deck = keyforgeApi.findDeckToImport(deckId)?.deck
            if (deck != null) {
                val expansion = Expansion.forExpansionNumber(deck.data.expansion)
                if (!activeExpansions.contains(expansion)) {
                    throw BadRequestException("$expansion is not yet enabled for import in DoK.")
                }

                val deckList = listOf(deck.data.copy(cards = deck.data._links?.cards))
                cardService.importNewCards(deck._linked.cards ?: error("No linked cards for importing deck"))
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
                val card: Card =
                    cardService.findByExpansionCardName(
                        deckBuilderData.expansion.expansionNumber,
                        it.name,
                        it.enhanced
                    )
                        ?: cardService.findByCardName(it.name)

                card.copy(house = entry.key)
            }
        }
        return Deck(
            keyforgeId = UUID.randomUUID().toString(),
            name = deckBuilderData.name,
            expansion = deckBuilderData.expansion.expansionNumber,
            tokenNumber = if (deckBuilderData.tokenTitle == null) null else TokenCard.ordinalByCardTitle(deckBuilderData.tokenTitle),
        ) to cards
    }

    /**
     * Only set current page if this is auto importing new decks
     *
     * returns Pair(count, newCard)
     */
    @Transactional(propagation = Propagation.REQUIRED)
    fun saveDecks(deck: List<KeyForgeDeck>, currentPage: Int? = null): Int {
        var savedCount = 0
        deck
            .forEach { keyforgeDeck ->
                if (deckRepo.findByKeyforgeId(keyforgeDeck.id) == null) {
                    val deckCards = keyforgeDeck.cards ?: keyforgeDeck._links?.cards
                    ?: error("Cards in the deck ${keyforgeDeck.id} are null.")

                    val cardsListWithToken = deckCards
                        .filter {
                            // Skip stupid tide card
                            it != "37377d67-2916-4d45-b193-bea6ecd853e3"
                        }
                        .map {
                            var dbCard = cardRepo.findByIdOrNull(it)
                            if (dbCard == null) {

                                try {
                                    val deckWithCards = keyforgeApi.findDeck(keyforgeDeck.id, true)
                                        ?: error("No deck for ${keyforgeDeck.id} in KeyForge API")

                                    cardService.importNewCards(deckWithCards._linked.cards!!)

                                    dbCard = cardRepo.findByIdOrNull(it)
                                        ?: error("No card for $it even after finding and saving deck cards")
                                } catch (e: HttpClientErrorException.TooManyRequests) {
                                    log.warn(
                                        "KeyForge API says we made too many requests when getting single deck's cards to import.",
                                        e
                                    )
                                    return savedCount
                                } catch (e: Exception) {
                                    log.error("Exception importing deck ${keyforgeDeck.id}")
                                    throw e
                                }
                            }
                            val cardServiceCard = cardService.findByCardName(dbCard.cardTitle)
                            dbCard.extraCardInfo = cardServiceCard.extraCardInfo
                            dbCard
                        }

                    val cardsList = cardsListWithToken.filter { !it.token }
                    val token = cardsListWithToken.firstOrNull { it.token }

                    if (cardsList.size != 36) error("Deck ${keyforgeDeck.id} must have 36 cards.")

                    val houses = keyforgeDeck._links?.houses?.mapNotNull { House.fromMasterVaultValue(it) }
                        ?: throw java.lang.IllegalStateException("Deck didn't have houses.")
                    check(houses.size == 3) { "Deck ${keyforgeDeck.id} doesn't have three houses!" }

                    val bonusIconSimpleCards = keyforgeDeck.createBonusIconsInfo(houses, cardsList)

                    val deckToSave = keyforgeDeck.toDeck().withBonusIcons(bonusIconSimpleCards)

                    try {
                        saveDeck(deckToSave, houses, cardsList, token)
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
            deckPageService.setCurrentPage(nextPage, DeckPageType.IMPORT)
        }
        return savedCount
    }

    fun viewTheoreticalDeck(deck: DeckBuildingData): Deck {
        val deckAndCards = makeBasicDeckFromDeckBuilderData(deck)
        return validateAndRateDeck(deckAndCards.first, deck.cards.keys.toList(), deckAndCards.second, deck.tokenTitle)
    }

    private fun saveDeck(deck: Deck, houses: List<House>, cardsList: List<Card>, token: Card?): Deck {
        val ratedDeck = validateAndRateDeck(deck, houses, cardsList, token?.cardTitle)
        val saved = deckRepo.save(ratedDeck)
        val deckSyns = rateDeck(deck)
        val dokCards = dokCardCacheService.cardsForDeck(deck)
        val sasVersion = sasVersionService.findSasVersion()
        deckSasValuesSearchableRepo.save(DeckSasValuesSearchable(ratedDeck, dokCards, deckSyns, sasVersion))
        deckSasValuesUpdatableRepo.save(DeckSasValuesUpdatable(ratedDeck, dokCards, deckSyns, sasVersion))

        postProcessDecksService.addPostProcessDeck(saved)
        return saved
    }

    private fun validateAndRateDeck(deck: Deck, houses: List<House>, cardsList: List<Card>, tokenName: String?): Deck {
        check(houses.size == 3) { "Deck doesn't have 3 houses! $deck" }
        check(cardsList.size == 36) { "Can't have a deck without 36 cards deck: $deck" }

        val saveable = deck
            .copy(
                evilTwin = cardsList.any { it.isEvilTwin() },
                houseNamesString = houses.sorted().joinToString("|"),
                cardIds = objectMapper.writeValueAsString(CardIds.fromCards(cardsList)),
                tokenNumber = if (tokenName == null) null else TokenCard.ordinalByCardTitle(tokenName)
            )

        check(saveable.cardIds.isNotBlank()) { "Can't save a deck without its card ids: $deck" }

        return saveable
    }

    fun rateDeck(inputDeck: Deck, majorRevision: Boolean = false): DeckSynergyInfo {
        val cards = dokCardCacheService.cardsForDeck(inputDeck)
        val token = dokCardCacheService.tokenForDeck(inputDeck)
        val deckSynergyInfo = DeckSynergyService.fromDeckWithCards(inputDeck, cards, token)
        return deckSynergyInfo
    }
}
