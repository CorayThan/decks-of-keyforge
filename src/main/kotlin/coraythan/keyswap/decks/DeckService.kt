package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import coraythan.keyswap.House
import coraythan.keyswap.stats.DeckStatisticsService
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserService
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class DeckService(
        val deckSynergyService: DeckSynergyService,
        val deckRepo: DeckRepo,
        val userService: KeyUserService,
        val currentUserService: CurrentUserService,
        val deckStatisticsService: DeckStatisticsService
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun filterDecks(filters: DeckFilters): DecksPage {
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()

        if (filters.houses.isNotEmpty()) {
            if (filters.houses.size < 4) {
                filters.houses.forEach { predicate.and(deckQ.houses.contains(it)) }
            } else {
                val excludeHouses = House.values().filter { !filters.houses.contains(it) }
                excludeHouses.forEach { predicate.and(deckQ.houses.contains(it).not()) }
            }
        }

        val forSaleOrTrade = BooleanBuilder().andAnyOf(deckQ.forSale.isTrue, deckQ.forTrade.isTrue)

        if (filters.owner.isNotBlank()) {
            log.info("filtering with owner name ${filters.owner}")
            predicate.and(deckQ.userDecks.any().user.username.eq(filters.owner))
            val allowToSeeAllDecks = userService.findUserProfile(filters.owner)?.allowUsersToSeeDeckOwnership ?: false
            if (!allowToSeeAllDecks) predicate.and(forSaleOrTrade)
        }
        if (filters.forSale && filters.forTrade) {
            predicate.and(forSaleOrTrade)
        } else {
            if (filters.forSale) predicate.and(deckQ.forSale.isTrue)
            if (filters.forTrade) predicate.and(deckQ.forTrade.isTrue)
        }
        if (filters.containsMaverick) predicate.and(deckQ.maverickCount.goe(1))
        if (filters.myDecks) {
            val user = currentUserService.loggedInUser()
            if (user != null) {
                predicate.and(deckQ.userDecks.any().user.id.eq(user.id))
                predicate.and(deckQ.userDecks.any().owned.isTrue)
            }
        }
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
            DeckSortOptions.FUNNIEST -> "funnyCount"
            DeckSortOptions.MOST_WISHLISTED -> "wishlistCount"
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
        val stats = deckStatisticsService.findCurrentStats()
        return DeckWithSynergyInfo(
                deck = deck,
                deckSynergyInfo = synergies,
                cardRatingPercentile = stats?.cardsRatingStats?.percentileForValue?.get(deck.cardsRating) ?: -1,
                synergyPercentile = stats?.synergyStats?.percentileForValue?.get(deck.synergyRating) ?: -1,
                antisynergyPercentile = stats?.antisynergyStats?.percentileForValue?.get(deck.antisynergyRating) ?: -1,
                sasPercentile = stats?.sasStats?.percentileForValue?.get(deck.sasRating) ?: -1
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

}
