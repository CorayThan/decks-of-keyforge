package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.KeyforgeApi
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.math.roundToInt

@Transactional
@Service
class DeckService(
        val keyforgeApi: KeyforgeApi,
        val cardService: CardService,
        val deckSynergyService: DeckSynergyService,
        val deckRepo: DeckRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

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

        if (filters.forSale) predicate.and(deckQ.forSale.isTrue)
        if (filters.forTrade) predicate.and(deckQ.forTrade.isTrue)
        if (filters.containsMaverick) predicate.and(deckQ.cards.any().maverick.isTrue)
        if (filters.title.isNotBlank()) predicate.and(deckQ.name.likeIgnoreCase("%${filters.title}%"))

        val sortProperty = when (filters.sort) {
            DeckSortOptions.ADDED_DATE -> "id"
            DeckSortOptions.DECK_NAME -> "name"
            DeckSortOptions.AMBER -> "expectedAmber"
            DeckSortOptions.POWER -> "totalPower"
            DeckSortOptions.CREATURES -> "totalCreatures"
            DeckSortOptions.MAVERICK_COUNT -> "maverickCount"
            DeckSortOptions.SPECIALS -> "specialsCount"
            DeckSortOptions.RARES -> "raresCount"
            DeckSortOptions.CARDS_RATING -> "cardsRating"
        }

        val deckPage = deckRepo.findAll(predicate, PageRequest.of(
                filters.page, 20,
                Sort.by(filters.sortDirection.direction, sortProperty)
        ))

        log.info("Found ${deckPage.content.size} decks. Current page ${filters.page}. Total pages ${deckPage.totalPages}. Sorted by $sortProperty.")

        return DecksPage(deckPage.content, filters.page, deckPage.totalPages)
    }

    fun findDeck(keyforgeId: String) = deckRepo.findByKeyforgeId(keyforgeId)

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
            deckRepo.saveAll(results.content.map {
                val ratedDeck = rateDeck(it)

                armorValues.incrementValue(ratedDeck.totalArmor)
                totalCreaturePower.incrementValue(ratedDeck.totalPower)
                expectedAmber.incrementValue(ratedDeck.expectedAmber.roundToInt())
                power2OrLower.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power < 3 }.size)
                power3OrLower.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power < 4 }.size)
                power3OrHigher.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power > 2 }.size)
                power4OrHigher.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power > 3 }.size)
                power5OrHigher.incrementValue(ratedDeck.cards.filter { it.cardType == CardType.Creature && it.power > 4 }.size)

                ratedDeck
            })
            currentPage++
        }
        val deckStatistics = DeckStatistics(
                armorValues, totalCreaturePower, expectedAmber,
                power2OrLower, power3OrLower, power3OrHigher,
                power4OrHigher, power5OrHigher
        )
        log.info(
                "Deck stats: $deckStatistics \n" +
                        "armor: ${deckStatistics.armorStats}\n" +
                        "expectedAmber: ${deckStatistics.expectedAmberStats}\n" +
                        "totalCreaturePower: ${deckStatistics.totalCreaturePowerStats}\n" +
                        "power2OrLower: ${deckStatistics.power2OrLowerStats}\n" +
                        "power3OrLower: ${deckStatistics.power3OrLowerStats}\n" +
                        "power3OrHigher: ${deckStatistics.power3OrHigherStats}\n" +
                        "power4OrHigher: ${deckStatistics.power4OrHigherStats}\n" +
                        "power5OrHigher: ${deckStatistics.power5OrHigherStats}"
        )
    }

    // @Scheduled(fixedDelay = 1000 * 60)
    fun importNewDecks() {

        val decksPerPage = 10
        val currentDecks = deckRepo.count().toInt()
        var currentPage = 1 + currentDecks / decksPerPage

        val newDeckTotal = keyforgeApi.findDecks(1, 1)?.count
        if (newDeckTotal == null) {
            log.warn("Got null when getting the count for all decks!")
            return
        }
        val finalPage = 1 + newDeckTotal / decksPerPage

        val maxPageRequests = 10
        var pagesRequested = 0
        while (currentPage < finalPage && pagesRequested < maxPageRequests) {
            val decks = keyforgeApi.findDecks(currentPage, decksPerPage)
//            log.info("Found decks from api count ${decks?.data?.size}.")
            if (decks == null) {
                log.warn("Got null decks from the api for page $currentPage decks per page $decksPerPage with new deck total $newDeckTotal")
            } else {
                cardService.importNewCards(decks.data)
                saveDecks(decks.data)
            }

            log.info("Loaded page $currentPage. Decks from db: ${deckRepo.findAll().count()}. Total current decks: $newDeckTotal")
            currentPage++
            pagesRequested++
        }
    }

    private fun saveDecks(deck: List<KeyforgeDeck>) {
        val saveableDecks = deck.map { keyforgeDeck ->

            val saveable = keyforgeDeck.toDeck()
                    .copy(
                            cards = keyforgeDeck.cards?.mapNotNull { cardService.cachedCards[it] }
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
                            maverickCount = saveable.cards.filter { it.maverick }.size,
                            specialsCount = saveable.cards.filter { it.rarity == Rarity.FIXED || it.rarity == Rarity.Variant }.size,
                            raresCount = saveable.cards.filter { it.rarity == Rarity.Rare }.size,
                            uncommonsCount = saveable.cards.filter { it.rarity == Rarity.Uncommon }.size
                    )
            )
        }

        deckRepo.saveAll(saveableDecks)
    }

    fun rateDeck(deck: Deck): Deck {
        val cards = cardService.fullCardsFromCards(deck.cards)
        val extraCardInfos = cards.map { it.extraCardInfo!! }
        val deckSynergyInfo = deckSynergyService.fromDeck(deck)
        val cardsRating = extraCardInfos.map { it.rating }.sum()
        return deck.copy(
                expectedAmber = extraCardInfos.map { it.expectedAmber }.sum(),
                amberControl = extraCardInfos.map { it.amberControl }.sum(),
                creatureControl = extraCardInfos.map { it.creatureControl }.sum(),
                artifactControl = extraCardInfos.map { it.artifactControl }.sum(),
                sasRating = cardsRating + deckSynergyInfo.synergyRating + deckSynergyInfo.antisynergyRating,
                cardsRating = cardsRating,
                synergyRating = deckSynergyInfo.synergyRating,
                antisynergyRating = deckSynergyInfo.antisynergyRating
        )
    }

}
