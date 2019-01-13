package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Ops
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import coraythan.keyswap.House
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.deckcard.QDeckCard
import coraythan.keyswap.stats.StatsService
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
        private val cardService: CardService,
        private val deckSynergyService: DeckSynergyService,
        private val deckRepo: DeckRepo,
        private val userService: KeyUserService,
        private val currentUserService: CurrentUserService,
        private val statsService: StatsService
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun filterDecks(filters: DeckFilters): DecksPage {
        val deckQ = QDeck.deck
        val deckCardQ = QDeckCard.deckCard
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

        if (filters.title.isNotBlank()) predicate.and(deckQ.name.likeIgnoreCase("%${filters.title}%"))
        if (filters.owner.isNotBlank()) {
            log.info("filtering with owner name ${filters.owner}")
            predicate.and(deckQ.userDecks.any().ownedBy.eq(filters.owner))
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
                predicate.and(deckQ.userDecks.any().ownedBy.eq(user.username))
            }
        }
        if (filters.constraints.isNotEmpty()) {
            filters.constraints.forEach {
                val pathToVal = Expressions.path(Double::class.java, deckQ, it.property)
                predicate.and(Expressions.predicate(if (it.cap == Cap.MIN) Ops.GOE else Ops.LOE, pathToVal, Expressions.constant(it.value)))
            }
        }

        filters.cards.forEach {
            if (it.quantity == 1) {
                predicate.and(deckQ.cards.any().cardName.eq(it.cardName))
            } else {
                predicate.and(
                        deckQ.cards.any().`in`(
                                JPAExpressions.selectFrom(deckCardQ)
                                        .where(
                                                deckCardQ.cardName.eq(it.cardName),
                                                deckCardQ.quantityInDeck.goe(it.quantity)
                                        )
                        )
                )
            }
        }

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
                filters.page, 10,
                Sort.by(filters.sortDirection.direction, sortProperty)
        ))

        val decks = deckPage.content.map {
            it.toDeckSearchResult(if (it.cardIds.isBlank()) {
                log.warn("No card ids available!")
                null
            } else {
                cardService.deckSearchResultCardsFromCardIds(it.cardIds)
            })
        }

        return DecksPage(decks, filters.page, deckPage.totalPages, deckPage.totalElements)
    }

    fun findDeck(keyforgeId: String) = deckRepo.findByKeyforgeId(keyforgeId)

    fun findDeckWithSynergies(keyforgeId: String): DeckWithSynergyInfo {

        val deck = findDeck(keyforgeId)!!
        val synergies = deckSynergyService.fromDeck(deck)
        val stats = statsService.findCurrentStats()
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
