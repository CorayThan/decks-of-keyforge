package coraythan.keyswap.decks

import com.fasterxml.jackson.databind.ObjectMapper
import coraythan.keyswap.KeyforgeApi
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.deckcard.CardIds
import coraythan.keyswap.deckcard.DeckCard
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.stats.incrementValue
import coraythan.keyswap.synergy.DeckSynergyService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.math.absoluteValue
import kotlin.math.roundToInt
import kotlin.system.measureTimeMillis

private const val lockImportNewDecksFor = "PT15S"
private const val lockUpdateStatistics = "PT72H"

@Transactional
@Service
class DeckImporterService(
        private val keyforgeApi: KeyforgeApi,
        private val cardService: CardService,
        private val deckSynergyService: DeckSynergyService,
        private val deckRepo: DeckRepo,
        private val deckPageService: DeckPageService,
        private val statsService: StatsService,
        private val objectMapper: ObjectMapper
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    // @Scheduled(fixedRateString = lockImportNewDecksFor)
    // @SchedulerLock(name = "importNewDecks", lockAtLeastForString = lockImportNewDecksFor, lockAtMostForString = lockImportNewDecksFor)
    fun importNewDecks() {

        val deckCountBeforeImport = deckRepo.count()
        val importDecksDuration = measureTimeMillis {
            val decksPerPage = 10
            var currentPage = deckPageService.findCurrentPage()

            val finalPage = currentPage + decksPerPage

            val maxPageRequests = 11
            var pagesRequested = 0
            while (currentPage < finalPage && pagesRequested < maxPageRequests) {
                val decks = keyforgeApi.findDecks(currentPage, decksPerPage)
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

    }

    //     @Scheduled(fixedRateString = lockUpdateStatistics)
    // @SchedulerLock(name = "updateStatistics", lockAtLeastForString = lockUpdateStatistics, lockAtMostForString = lockUpdateStatistics)
    fun updateDeckStatsAndRateDecks() {
        log.info("Began update to deck statistics.")
        if (deckPageService.findCurrentPage() > 100) {
            updateDeckStatisticsPrivate()
        }
        log.info("Updated deck statistics.")
    }

    // @Scheduled(fixedRateString = lockUpdateStatistics)
    fun rateDecks() {
        val sort = Sort.by("id")
        var currentPage = 0
        val pageSize = 100
        while (true) {

            val results = deckRepo.findAll(PageRequest.of(currentPage, pageSize, sort))
            if (results.isEmpty) {
                break
            }
            if (currentPage % 100 == 0) log.info("Rating decks, currently on deck ${currentPage * pageSize}")

            results.content.forEach {
                val ratedDeck = rateDeck(it)
                deckRepo.save(ratedDeck)
            }
            currentPage++
        }
        log.info("Done rating decks.")
    }

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
        val sort = Sort.by("id")
        var currentPage = 0
        val pageSize = 100
        while (true) {

            val results = deckRepo.findAll(PageRequest.of(currentPage, pageSize, sort))
            if (results.isEmpty) {
                break
            }
            if (currentPage % 100 == 0) log.info("Updating stats, currently on deck ${currentPage * pageSize}")

            results.content.forEach {
                val cards = cardService.cardsForDeck(it)
                val ratedDeck = rateDeck(it)
                deckRepo.save(ratedDeck)

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
                power2OrLower.incrementValue(cards.filter { card -> card.cardType == CardType.Creature && card.power < 3 }.size)
                power3OrLower.incrementValue(cards.filter { card -> card.cardType == CardType.Creature && card.power < 4 }.size)
                power3OrHigher.incrementValue(cards.filter { card -> card.cardType == CardType.Creature && card.power > 2 }.size)
                power4OrHigher.incrementValue(cards.filter { card -> card.cardType == CardType.Creature && card.power > 3 }.size)
                power5OrHigher.incrementValue(cards.filter { card -> card.cardType == CardType.Creature && card.power > 4 }.size)
            }

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
        statsService.setStats(deckStatistics)
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

    private fun saveDecks(deck: List<KeyforgeDeck>, cardsForDecks: List<Card>) {
        val cardsById: Map<String, Card> = cardsForDecks.associate { it.id to it }
        deck
                .mapNotNull { if (deckRepo.findByKeyforgeId(it.id) == null) it else null }
                .forEach { keyforgeDeck ->

                    val cardsList = keyforgeDeck.cards?.map { cardsById[it]!! } ?: listOf()
                    val savedDeck = deckRepo.save(keyforgeDeck.toDeck())

                    val deckCards = cardsList.map { card ->
                        DeckCard(savedDeck, card, card.cardTitle, cardsList.count { card.cardTitle == it.cardTitle })
                    }

                    val saveable = savedDeck
                            .copy(
                                    cards = deckCards,
                                    houses = keyforgeDeck._links?.houses ?: throw java.lang.IllegalStateException("Deck didn't have houses."),
                                    cardIds = objectMapper.writeValueAsString(CardIds.fromCards(cardsList))
                            )

                    val ratedDeck = rateDeck(saveable
                            .copy(
                                    rawAmber = cardsList.map { it.amber }.sum(),
                                    totalPower = cardsList.map { it.power }.sum(),
                                    totalArmor = cardsList.map { it.armor }.sum(),
                                    totalCreatures = cardsList.filter { it.cardType == CardType.Creature }.size,
                                    totalActions = cardsList.filter { it.cardType == CardType.Action }.size,
                                    totalArtifacts = cardsList.filter { it.cardType == CardType.Artifact }.size,
                                    totalUpgrades = cardsList.filter { it.cardType == CardType.Upgrade }.size,
                                    maverickCount = cardsList.filter { it.maverick }.size,
                                    specialsCount = cardsList.filter { it.rarity == Rarity.FIXED || it.rarity == Rarity.Variant }.size,
                                    raresCount = cardsList.filter { it.rarity == Rarity.Rare }.size,
                                    uncommonsCount = cardsList.filter { it.rarity == Rarity.Uncommon }.size
                            )
                    )

                    if (ratedDeck.cards.size != 36) {
                        throw IllegalStateException("Can't have a deck without 36 cards deck: $deck")
                    }
                    if (ratedDeck.houses.size != 3) {
                        throw IllegalStateException("Deck doesn't have 3 houses! $deck")
                    }
                    deckRepo.save(ratedDeck)
                }
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
                sasRating = cardsRating + synergy + antisynergy,
                cardsRating = cardsRating,
                synergyRating = synergy,
                antisynergyRating = antisynergy.absoluteValue
        )
    }

}
