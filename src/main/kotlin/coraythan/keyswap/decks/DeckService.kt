package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Ops
import com.querydsl.core.types.dsl.ComparableExpressionBase
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.House
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.deckcard.QDeckCard
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.userdeck.QUserDeck
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import javax.persistence.EntityManager

@Transactional
@Service
class DeckService(
        private val cardService: CardService,
        private val deckSynergyService: DeckSynergyService,
        private val deckRepo: DeckRepo,
        private val userService: KeyUserService,
        private val currentUserService: CurrentUserService,
        private val statsService: StatsService,
        private val entityManager: EntityManager
) {
    private val log = LoggerFactory.getLogger(this::class.java)
    private val deckPageSize = 20L
    private val defaultFilters = DeckFilters()
    private val query = JPAQueryFactory(entityManager)

    var deckCount: Long? = null

    fun countFilters(filters: DeckFilters): DeckCount {

        val count: Long
        val preExistingCount = deckCount
        val filtersAreEqual = filters.copy(
                sort = defaultFilters.sort,
                sortDirection = defaultFilters.sortDirection
        ) == defaultFilters
        if (preExistingCount != null && filtersAreEqual) {
            count = preExistingCount
        } else {

            val predicate = deckFilterPedicate(filters)

            if (filtersAreEqual) {

                count = deckRepo.count()
                deckCount = count

            } else {

                val deckQ = QDeck.deck
                count = query
                        .select(deckQ.id)
                        .from(deckQ)
                        .where(predicate)
                        .limit(1000)
                        .fetch()
                        .count()
                        .toLong()
            }
        }

        return DeckCount(
                pages = (count + deckPageSize - 1) / deckPageSize,
                count = count
        )
    }

    fun filterDecks(filters: DeckFilters): DecksPage {

        val predicate = deckFilterPedicate(filters)
        val deckQ = QDeck.deck
        val sortProperty = when (filters.sort) {
            DeckSortOptions.ADDED_DATE -> deckQ.id
            DeckSortOptions.CARDS_RATING -> deckQ.cardsRating
            DeckSortOptions.SAS_RATING -> deckQ.sasRating
            DeckSortOptions.FUNNIEST -> deckQ.funnyCount
            DeckSortOptions.MOST_WISHLISTED -> deckQ.wishlistCount
            DeckSortOptions.NAME -> deckQ.name
        }

        val sort = if (
                filters.sortDirection == SortDirection.DESC
                || filters.sort == DeckSortOptions.FUNNIEST
                || filters.sort == DeckSortOptions.MOST_WISHLISTED
        ) {
            (sortProperty as ComparableExpressionBase).desc()
        } else {
            (sortProperty as ComparableExpressionBase).asc()
        }

        val deckResults = query.selectFrom(deckQ)
                .where(predicate)
                .limit(deckPageSize)
                .offset(filters.page * deckPageSize)
                .apply {
                    if (filters.sort != DeckSortOptions.ADDED_DATE) {
                        orderBy(sort, deckQ.id.asc())
                    } else {
                        orderBy(sort)
                    }
                }
                .fetch()

        val decks = deckResults.map {
            it.toDeckSearchResult(cardService.deckSearchResultCardsFromCardIds(it.cardIds))
        }

        return DecksPage(
                decks,
                filters.page
        )
    }

    private fun deckFilterPedicate(filters: DeckFilters): BooleanBuilder {
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

        if (filters.title.isNotBlank()) predicate.and(deckQ.name.likeIgnoreCase("%${filters.title.toLowerCase()}%"))
        if (filters.owner.isNotBlank()) {

            if (currentUserService.loggedInUser()?.username == filters.owner) {
                // it's me
                val user = currentUserService.loggedInUser()
                if (user != null) predicate.and(deckQ.userDecks.any().ownedBy.eq(user.username))
            } else {
                val allowToSeeAllDecks = userService.findUserProfile(filters.owner)?.allowUsersToSeeDeckOwnership ?: false

                if (allowToSeeAllDecks) {
                    predicate.and(deckQ.userDecks.any().ownedBy.eq(filters.owner))
                } else {
                    val userDeckQ = QUserDeck.userDeck
                    predicate.and(
                            deckQ.userDecks.any().`in`(
                                    JPAExpressions.selectFrom(userDeckQ)
                                            .where(
                                                    userDeckQ.ownedBy.eq(filters.owner),
                                                    userDeckQ.forSale.isTrue
                                                            .or(userDeckQ.forTrade.isTrue)
                                            )
                            )
                    )
                }
            }
        }
        if (filters.myFavorites) {
            val userDeckQ = QUserDeck.userDeck
            predicate.and(
                    deckQ.userDecks.any().`in`(
                            JPAExpressions.selectFrom(userDeckQ)
                                    .where(
                                            userDeckQ.user.id.eq(currentUserService.loggedInUser()?.id),
                                            userDeckQ.wishlist.isTrue
                                    )
                    )
            )
        }
        if (filters.forSale && filters.forTrade) {
            predicate.and(forSaleOrTrade)
        } else {
            if (filters.forSale) predicate.and(deckQ.forSale.isTrue)
            if (filters.forTrade) predicate.and(deckQ.forTrade.isTrue)
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
        return predicate
    }

    fun findDeckSimple(keyforgeId: String): DeckSearchResult {
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: throw BadRequestException("Can't find a deck with id $keyforgeId")
        return deck.toDeckSearchResult(listOf())
    }

    fun findDeckWithSynergies(keyforgeId: String): DeckWithSynergyInfo {
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: throw BadRequestException("Can't find a deck with id $keyforgeId")
        val synergies = deckSynergyService.fromDeck(deck)
        val stats = statsService.findCurrentStats()
        return DeckWithSynergyInfo(
                deck = deck.toDeckSearchResult(cardService.deckSearchResultCardsFromCardIds(deck.cardIds)),
                deckSynergyInfo = synergies,
                cardRatingPercentile = stats?.cardsRatingStats?.percentileForValue?.get(deck.cardsRating) ?: -1,
                synergyPercentile = stats?.synergyStats?.percentileForValue?.get(deck.synergyRating) ?: -1,
                antisynergyPercentile = stats?.antisynergyStats?.percentileForValue?.get(deck.antisynergyRating) ?: -1,
                sasPercentile = stats?.sasStats?.percentileForValue?.get(deck.sasRating) ?: -1
        )
    }

    fun saleInfoForDeck(keyforgeId: String): List<DeckSaleInfo> {
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: return listOf()
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
                        dateListed = it.dateListed!!.toLocalDate(),
                        dateExpires = it.expiresAt!!.toLocalDate(),
                        username = it.user.username,
                        publicContactInfo = it.user.publicContactInfo
                )
            }
        }.sortedByDescending { it.dateListed }
    }

}
