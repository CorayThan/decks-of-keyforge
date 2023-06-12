package coraythan.keyswap.decks

import com.fasterxml.jackson.databind.ObjectMapper
import coraythan.keyswap.House
import coraythan.keyswap.cards.*
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.Env
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.models.*
import coraythan.keyswap.decks.pastsas.PastSasService
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.expansions.activeExpansions
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.synergy.DeckSynergyInfo
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.thirdpartyservices.mastervault.KeyForgeDeck
import coraythan.keyswap.thirdpartyservices.mastervault.KeyforgeApi
import coraythan.keyswap.thirdpartyservices.mastervault.keyforgeApiDeckPageSize
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
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
    private val pastSasService: PastSasService,
    private val postProcessDecksService: PostProcessDecksService,
    @Value("\${env}")
    private val env: Env,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    private var refreshBonusIcons = true

    fun refreshBonusIcons() {
        if (!refreshBonusIcons) return

        log.info("Bonus Icons Refresh: Start")

        val foundDecks = deckRepo.findTop4ByRefreshedBonusIconsIsNullAndExpansionIn(
            setOf(
                Expansion.MASS_MUTATION.expansionNumber,
                Expansion.DARK_TIDINGS.expansionNumber
            )
        )

        if (foundDecks.isEmpty()) {
            this.refreshBonusIcons = false
            log.info("Bonus Icons Refresh: All done!")
            return
        }

        val decksToEvaluate: Map<Boolean, List<Deck>> = foundDecks
            .groupBy { deck ->
                val cards = cardService.cardsForDeck(deck)
                cards.any {
                    val card = cardService.findByCardName(it.cardTitle)
                    (card?.extraCardInfo?.enhancementCount() ?: 0) > 0
                }
            }

        val toSkip = decksToEvaluate[false]
        if (toSkip != null) {
            deckRepo.saveAll(toSkip.map { it.copy(refreshedBonusIcons = true) })
        }

        val savedDeckIds = mutableListOf<String>()

        decksToEvaluate[true]?.forEach {
            try {

                val findDeckResponse = keyforgeApi.findDeckToImport(it.keyforgeId)
                val keyforgeDeck = findDeckResponse?.deck
                val errorFound = findDeckResponse?.error

                if (errorFound != null) {
                    log.warn("Bonus Icons Refresh: Find KF deck ${it.name} ${it.keyforgeId} had error $errorFound")
                }

                if (keyforgeDeck == null) {
                    log.warn("Bonus Icons Refresh: Error retrieving deck ${it.name}  ${it.keyforgeId}")
                } else {
                    val houses = keyforgeDeck.data._links?.houses?.mapNotNull { House.fromMasterVaultValue(it) }
                        ?: throw java.lang.IllegalStateException("Deck didn't have houses ${it.keyforgeId}.")

                    val deckCards =
                        keyforgeDeck.data._links.cards ?: error("Cards in the deck ${keyforgeDeck.data.id} are null.")

                    val cardsList = deckCards
                        .filter {
                            // Skip stupid tide card
                            it != "37377d67-2916-4d45-b193-bea6ecd853e3"
                        }
                        .map { cardId ->
                            val dbCard = cardRepo.findByIdOrNull(cardId) ?: error("No card in db for $cardId")
                            val cardServiceCard = cardService.findByCardName(dbCard.cardTitle)
                                ?: error("No card in card service for ${dbCard.cardTitle}")
                            dbCard.extraCardInfo = cardServiceCard.extraCardInfo
                            dbCard
                        }


                    val bonusIconSimpleCards = keyforgeDeck.data.createBonusIconsInfo(houses, cardsList)
                    val deckToSave = it
                        .withBonusIcons(bonusIconSimpleCards)
                        .copy(refreshedBonusIcons = true)

                    deckRepo.save(deckToSave)
                    savedDeckIds.add(it.keyforgeId)
                }

            } catch (e: Exception) {
                log.warn(
                    "Bonus Icons Refresh: Failed to update a deck's bonus icons due to exception. Deck is ${it.keyforgeId} ${it.name}. Message: ${e.message}"
                )
            }
        }
        log.info("Bonus Icons Refresh: End. Skipped ${toSkip?.size} Updated decks: $savedDeckIds")
    }


    @Transactional(propagation = Propagation.NEVER)
    @Scheduled(
        fixedDelayString = lockImportNewDecksFor,
        initialDelayString = SchedulingConfig.importNewDecksInitialDelay
    )
    @SchedulerLock(
        name = "importNewDecks",
        lockAtLeastFor = lockImportNewDecksFor,
        lockAtMostFor = lockImportNewDecksFor
    )
    fun importNewDecks() {
        log.info("$scheduledStart new deck import.")

        val deckCountBeforeImport = deckRepo.estimateRowCount()

        deckImportingUpToDate = false
        var decksAdded = 0
        var pagesRequested = 0
        val importDecksDuration = measureTimeMillis {
            var currentPage = deckPageService.findCurrentPage()

            val maxPageRequests = 20
            while (pagesRequested < maxPageRequests) {
                if (pagesRequested != 0) Thread.sleep(3000)
                log.info("Importing decks, making page request $currentPage")
                try {
                    val decks = keyforgeApi.findDecks(currentPage, useMasterVault = true, withCards = true)
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

                        val decksToSaveCount = decks.data.count()

                        val results = saveDecks(decks.data, currentPage)

                        decksAdded += results
                        currentPage++
                        pagesRequested++

                        if (decksToSaveCount < keyforgeApiDeckPageSize || results < keyforgeApiDeckPageSize) {
                            deckImportingUpToDate = true
                            log.info("Stopped getting decks, decks to save was $decksToSaveCount, added was $results < $keyforgeApiDeckPageSize")
                            break
                        }
                    }
                } catch (e: HttpClientErrorException.TooManyRequests) {
                    log.warn("KeyForge API says we made too many requests. Sad day." + e.message)
                    break
                }
            }
        }
        val deckCountNow = deckRepo.count()
        log.info(
            "$scheduledStop Added $decksAdded decks. Total decks: $deckCountNow. Decks added by counts ${deckCountNow - deckCountBeforeImport} " +
                    "Pages requested $pagesRequested It took ${importDecksDuration / 1000} seconds."
        )
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
                    quantFound += deckResults.decks.size

                    val rated: List<Pair<Deck, DeckSynergyInfo>> = deckResults.decks.mapNotNull {
                        val deckSynergiesPair = rateDeck(it, majorRevision)
                        val rated = deckSynergiesPair.first.copy(lastUpdate = ZonedDateTime.now())
                        if (rated.ratingsEqual(it)) {
                            null
                        } else {
                            Pair(rated, deckSynergiesPair.second)
                        }
                    }
                    quantRerated += rated.size
                    if (rated.isNotEmpty()) {
                        deckRepo.saveAll(rated.map { it.first })
                        pastSasService.createAll(rated)
                    }
                    deckRatingProgressService.revPage()

                    if (!deckResults.moreResults) {
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
            val deck = keyforgeApi.findDeckToImport(deckId)?.deck
            if (deck != null) {
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
                    cardService.findByExpansionCardName(deckBuilderData.expansion.expansionNumber, it.name, it.enhanced)
                        ?: cardService.findByCardName(it.name)
                        ?: throw BadRequestException("Couldn't find card with expansion ${deckBuilderData.expansion.expansionNumber} name $it and house ${entry.key}")

                card.copy(house = entry.key)
            }
        }
        return Deck(
            keyforgeId = UUID.randomUUID().toString(),
            name = deckBuilderData.name,
            expansion = deckBuilderData.expansion.expansionNumber,
            tokenId = deckBuilderData.tokenId,
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
                                }
                            }
                            val cardServiceCard = cardService.findByCardName(dbCard.cardTitle)
                                ?: error("No card in card service for ${dbCard.cardTitle}")
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
            deckPageService.setCurrentPage(nextPage)
        }
        return savedCount
    }

    fun viewTheoreticalDeck(deck: DeckBuildingData): Deck {
        val deckAndCards = makeBasicDeckFromDeckBuilderData(deck)
        val tokenCard = if (deck.tokenId == null) {
            null
        } else {
            this.cardService.findTokenById(deck.tokenId)
        }
        return validateAndRateDeck(deckAndCards.first, deck.cards.keys.toList(), deckAndCards.second, tokenCard)
    }

    private fun saveDeck(deck: Deck, houses: List<House>, cardsList: List<Card>, token: Card?): Deck {
        val ratedDeck = validateAndRateDeck(deck, houses, cardsList, token)
        val saved = deckRepo.save(ratedDeck)

        postProcessDecksService.addPostProcessDeck(saved)
        return saved
    }

    private fun validateAndRateDeck(deck: Deck, houses: List<House>, cardsList: List<Card>, token: Card?): Deck {
        check(houses.size == 3) { "Deck doesn't have 3 houses! $deck" }
        check(cardsList.size == 36) { "Can't have a deck without 36 cards deck: $deck" }

        val saveable = deck
            .withCards(cardsList)
            .copy(
                houseNamesString = houses.sorted().joinToString("|"),
                cardIds = objectMapper.writeValueAsString(CardIds.fromCards(cardsList)),
                tokenId = token?.id
            )

        val ratedDeck = rateDeck(saveable).first

        check(!ratedDeck.cardIds.isBlank()) { "Can't save a deck without its card ids: $deck" }

        return ratedDeck
    }

    fun rateDeck(deck: Deck, majorRevision: Boolean = false): Pair<Deck, DeckSynergyInfo> {
        val cards = cardService.cardsForDeck(deck)
        val token = cardService.tokenForDeck(deck)
        val deckSynergyInfo = DeckSynergyService.fromDeckWithCards(deck, cards, token)
        val bonusDraw = cards.mapNotNull { it.extraCardInfo?.enhancementDraw }.sum()
        val bonusCapture = cards.mapNotNull { it.extraCardInfo?.enhancementCapture }.sum()
        return Pair(
            deck.copy(

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
                recursion = deckSynergyInfo.recursion,
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
            ), deckSynergyInfo
        )
    }
}
