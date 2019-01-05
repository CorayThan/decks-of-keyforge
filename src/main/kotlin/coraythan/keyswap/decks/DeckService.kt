package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.KeyforgeApi
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.math.absoluteValue
import kotlin.math.roundToInt

@Transactional
@Service
class DeckService(
        val keyforgeApi: KeyforgeApi,
        val cardService: CardService,
        val deckSynergyService: DeckSynergyService,
        val deckRepo: DeckRepo,
        val deckPageService: DeckPageService
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    var deckStatistics: DeckStatistics? = null

    fun filterDecks(filters: DeckFilters): DecksPage {
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()

        if (filters.houses.isNotEmpty()) {
            if (filters.houses.size < 4) {
                filters.houses.forEach { predicate.and(deckQ.houses.contains(it)) }
            } else {
                filters.houses.forEach { predicate.and(deckQ.houses.any().eq(it)) }
            }
        }

        log.info("filtering with owner name ${filters.owner}")
        if (filters.owner.isNotBlank()) predicate.and(deckQ.userDecks.any().user.username.eq(filters.owner))
        if (filters.forSale) predicate.and(deckQ.forSale.isTrue)
        if (filters.forTrade) predicate.and(deckQ.forTrade.isTrue)
        if (filters.containsMaverick) predicate.and(deckQ.cards.any().maverick.isTrue)
        if (filters.title.isNotBlank()) predicate.and(deckQ.name.likeIgnoreCase("%${filters.title}%"))

        val sortProperty = when (filters.sort) {
            DeckSortOptions.ADDED_DATE -> "id"
            DeckSortOptions.EXPECTED_AMBER -> "expectedAmber"
            DeckSortOptions.TOTAL_CREATURE_POWER -> "totalPower"
            DeckSortOptions.CREATURE_COUNT -> "totalCreatures"
            DeckSortOptions.MAVERICK_COUNT -> "maverickCount"
            DeckSortOptions.SPECIALS -> "specialsCount"
            DeckSortOptions.RARES -> "raresCount"
            DeckSortOptions.CARDS_RATING -> "cardsRating"
            DeckSortOptions.SAS_RATING -> "sasRating"
            DeckSortOptions.SYNERGY -> "synergyRating"
            DeckSortOptions.ANTISYNERGY -> "antisynergyRating"
        }

        val deckPage = deckRepo.findAll(predicate, PageRequest.of(
                filters.page, 20,
                Sort.by(filters.sortDirection.direction, sortProperty)
        ))

        log.info("Found ${deckPage.content.size} decks. Current page ${filters.page}. Total pages ${deckPage.totalPages}. Sorted by $sortProperty.")

        return DecksPage(deckPage.content, filters.page, deckPage.totalPages)
    }

    fun findDeck(keyforgeId: String) = deckRepo.findByKeyforgeId(keyforgeId)

    fun findDeckWithSynergies(keyforgeId: String): DeckWithSynergyInfo {
        val deck = findDeck(keyforgeId)!!
        val synergies = deckSynergyService.fromDeck(deck)
        return DeckWithSynergyInfo(
                deck = deck,
                deckSynergyInfo = synergies,
                cardRatingPercentile = this.deckStatistics?.cardsRatingStats?.percentileForValue?.get(deck.cardsRating) ?: -1,
                synergyPercentile = this.deckStatistics?.synergyStats?.percentileForValue?.get(deck.synergyRating) ?: -1,
                antisynergyPercentile = this.deckStatistics?.antisynergyStats?.percentileForValue?.get(deck.antisynergyRating) ?: -1,
                sasPercentile = this.deckStatistics?.sasStats?.percentileForValue?.get(deck.sasRating) ?: -1
        )
    }

    fun saleInfoForDeck(keyforgeId: String): List<DeckSaleInfo> {
        val deck = findDeck(keyforgeId) ?: return listOf()
        return deck.userDecks.mapNotNull {
            if (!it.forSale && !it.forTrade) {
                null
            } else {
                DeckSaleInfo(
                        forSale = it.forSale,
                        forTrade = it.forTrade,
                        askingPrice = it.askingPrice,
                        listingInfo = it.listingInfo,
                        externalLink = it.externalLink,
                        condition = it.condition!!,
                        dateListed = it.dateListed,
                        username = it.user.username,
                        publicContactInfo = it.user.publicContactInfo
                )
            }
        }.sortedByDescending { it.dateListed }
    }

    fun updateDeckRatings(calculateAveragesOnly: Boolean = false) {
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
        val sort = Sort.by("id")
        var currentPage = 0
        while (true) {
            val results = deckRepo.findAll(PageRequest.of(currentPage, 100, sort))
            if (results.isEmpty) {
                break
            }

            val decksToSave = results.content.map {
                val ratedDeck = rateDeck(it)

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
                power2OrLower.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power < 3 }.size)
                power3OrLower.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power < 4 }.size)
                power3OrHigher.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power > 2 }.size)
                power4OrHigher.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power > 3 }.size)
                power5OrHigher.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power > 4 }.size)

                ratedDeck
            }

            if (!calculateAveragesOnly) deckRepo.saveAll(decksToSave)
            currentPage++
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
                power5OrHigher = power5OrHigher
        )
        this.deckStatistics = deckStatistics
        log.info(
                "Deck stats:\n" +
                        "armor: ${deckStatistics.armorStats}\n" +
                        "expectedAmber: ${deckStatistics.expectedAmberStats}\n" +
                        "amberControl: ${deckStatistics.amberControlStats}\n" +
                        "creature control: ${deckStatistics.creatureControlStats}\n" +
                        "artifact control: ${deckStatistics.artifactControlStats}\n" +
                        "sas stats: ${deckStatistics.sasStats}\n" +
                        "cards rating: ${deckStatistics.cardsRatingStats}\n" +
                        "synergy: ${deckStatistics.synergyStats}\n" +
                        "antisynergy: ${deckStatistics.antisynergyStats}\n" +
                        "totalCreaturePower: ${deckStatistics.totalCreaturePowerStats}\n" +
                        "creatureCounts: ${deckStatistics.creatureCountStats}\n" +
                        "artifactCounts: ${deckStatistics.artifactCountStats}\n" +
                        "actionCounts: ${deckStatistics.actionCountStats}\n" +
                        "upgradeCounts: ${deckStatistics.upgradeCountStats}\n" +
                        "power2OrLower: ${deckStatistics.power2OrLowerStats}\n" +
                        "power3OrLower: ${deckStatistics.power3OrLowerStats}\n" +
                        "power3OrHigher: ${deckStatistics.power3OrHigherStats}\n" +
                        "power4OrHigher: ${deckStatistics.power4OrHigherStats}\n" +
                        "power5OrHigher: ${deckStatistics.power5OrHigherStats}"
        )
    }

    @Scheduled(fixedDelay = 1000 * 60 * 60)
    fun updateRatings() {
        if (deckPageService.findCurrentPage() > 100) {
            updateDeckRatings(true)
            log.info("Updated deck ratings.")
        }
    }

    @Scheduled(fixedDelay = 1000 * 60 * 1)
    fun importNewDecks() {

        val decksPerPage = 10
        var currentPage = deckPageService.findCurrentPage()

        val finalPage = currentPage + decksPerPage

        val maxPageRequests = 11
        var pagesRequested = 0
        while (currentPage < finalPage && pagesRequested < maxPageRequests) {
            val decks = keyforgeApi.findDecks(currentPage, decksPerPage)
            if (decks == null) {
                log.warn("Got null decks from the api for page $currentPage decks per page $decksPerPage")
            } else {
                val cards = cardService.importNewCards(decks.data)
                saveDecks(decks.data, cards)
            }

            log.info("Loaded page $currentPage. Decks from db: ${deckRepo.findAll().count()}. Total current decks: ${decks?.count}")
            currentPage++
            pagesRequested++
        }

        deckPageService.setCurrentPage(currentPage - 2)
    }

    private fun saveDecks(deck: List<KeyforgeDeck>, cardsForDecks: List<Card>) {
        val cardsById: Map<String, Card> = cardsForDecks.associate { it.id to it }
        val saveableDecks = deck.map { keyforgeDeck ->

            val saveable = keyforgeDeck.toDeck()
                    .copy(
                            cards = keyforgeDeck.cards?.map { cardsById[it]!! }
                                    ?: throw IllegalStateException("Can't have a deck with no cards deck: $deck"),
                            houses = keyforgeDeck._links?.houses ?: throw java.lang.IllegalStateException("Deck didn't have houses.")
                    )
            if (saveable.cards.size != 36) {
                throw java.lang.IllegalStateException("Can't have a deck without 36 cards deck: $deck")
            }
            rateDeck(saveable
                    .copy(
                            rawAmber = saveable.cards.map { it.amber }.sum(),
                            totalPower = saveable.cards.map { it.power }.sum(),
                            totalArmor = saveable.cards.map { it.armor }.sum(),
                            totalCreatures = saveable.cards.filter { it.cardType == CardType.Creature }.size,
                            totalActions = saveable.cards.filter { it.cardType == CardType.Action }.size,
                            totalArtifacts = saveable.cards.filter { it.cardType == CardType.Artifact }.size,
                            totalUpgrades = saveable.cards.filter { it.cardType == CardType.Upgrade }.size,
                            maverickCount = saveable.cards.filter { it.maverick }.size,
                            specialsCount = saveable.cards.filter { it.rarity == Rarity.FIXED || it.rarity == Rarity.Variant }.size,
                            raresCount = saveable.cards.filter { it.rarity == Rarity.Rare }.size,
                            uncommonsCount = saveable.cards.filter { it.rarity == Rarity.Uncommon }.size
                    )
            )
        }
        saveOrUpdateDecks(saveableDecks)
    }

    fun saveOrUpdateDecks(decks: List<Deck>) {

        val saveDecks = decks.mapNotNull {
            val deck = deckRepo.findByKeyforgeId(it.keyforgeId)

            if (deck == null) {
                it
            } else {

                // Don't resave unless we need to
//                val toSave = it.copy(id = deck.id)
//                deckRepo.save(toSave)

                null
            }
        }

        deckRepo.saveAll(saveDecks)
    }

    fun rateDeck(deck: Deck): Deck {
        val cards = cardService.fullCardsFromCards(deck.cards)
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
                sasRating = cardsRating + synergy + antisynergy,
                cardsRating = cardsRating,
                synergyRating = synergy,
                antisynergyRating = antisynergy.absoluteValue
        )
    }

}
