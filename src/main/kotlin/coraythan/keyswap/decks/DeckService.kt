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
import coraythan.keyswap.decks.models.*
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.userdeck.QUserDeck
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
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
        entityManager: EntityManager
) {
    private val log = LoggerFactory.getLogger(this::class.java)
    private val defaultFilters = DeckFilters()
    private val defaultFilters100Results = DeckFilters().copy(pageSize = 100)
    private val defaultFiltersSecondPage = DeckFilters().copy(page = defaultFilters.page + 1)
    private val defaultFiltersSecondPage100Results = DeckFilters().copy(page = defaultFilters.page + 1, pageSize = 100)
    private val query = JPAQueryFactory(entityManager)

    var deckCount: Long? = null
    var firstPageCached: DecksPage? = null
    var secondPageCached: DecksPage? = null
    var firstPageCached100Results: DecksPage? = null
    var secondPageCached100Results: DecksPage? = null

    fun clearCachedValues() {
        deckCount = null
        firstPageCached = null
        secondPageCached = null
        firstPageCached100Results = null
        secondPageCached100Results = null
    }

    fun countFilters(filters: DeckFilters): DeckCount {

        val count: Long
        val preExistingCount = deckCount
        if (preExistingCount != null && filtersAreEqualForCount(filters)) {
            count = preExistingCount
        } else {

            val predicate = deckFilterPedicate(filters)

            if (filtersAreEqualForCount(filters)) {

                count = deckRepo.count()
                deckCount = count

            } else {

                val deckQ = QDeck.deck
                count = query
                        .select(deckQ.id)
                        .from(deckQ)
                        .where(predicate)
                        .limit(if (filters.forSale || filters.forTrade) 10000 else 1000)
                        .fetch()
                        .count()
                        .toLong()
            }
        }

        return DeckCount(
                pages = (count + filters.pageSize - 1) / filters.pageSize,
                count = count
        )
    }

    fun filterDecks(filters: DeckFilters): DecksPage {

        val cachedFirstPage = firstPageCached
        if (filters == defaultFilters && cachedFirstPage != null) {
            return cachedFirstPage
        }
        val cachedSecondPage = secondPageCached
        if (filters == defaultFiltersSecondPage && cachedSecondPage != null) {
            return cachedSecondPage
        }
        val cachedFirstPage100Results = firstPageCached100Results
        if (filters == defaultFilters100Results && cachedFirstPage100Results != null) {
            return cachedFirstPage100Results
        }
        val cachedSecondPage100Results = secondPageCached100Results
        if (filters == defaultFiltersSecondPage100Results && cachedSecondPage100Results != null) {
            return cachedSecondPage100Results
        }

        val predicate = deckFilterPedicate(filters)
        val deckQ = QDeck.deck
        val sortProperty = when (filters.sort) {
            DeckSortOptions.ADDED_DATE -> deckQ.id
            DeckSortOptions.CARDS_RATING -> deckQ.cardsRating
            DeckSortOptions.AERC_SCORE -> deckQ.aercScore
            DeckSortOptions.CHAINS -> deckQ.chains
            DeckSortOptions.SAS_RATING -> deckQ.sasRating
            DeckSortOptions.FUNNIEST -> deckQ.funnyCount
            DeckSortOptions.MOST_WISHLISTED -> deckQ.wishlistCount
            DeckSortOptions.NAME -> deckQ.name
        }

        val sort = if (
                filters.sortDirection == SortDirection.DESC
                || filters.sort == DeckSortOptions.FUNNIEST
                || filters.sort == DeckSortOptions.MOST_WISHLISTED
                || filters.sort == DeckSortOptions.CHAINS
        ) {
            (sortProperty as ComparableExpressionBase).desc()
        } else {
            (sortProperty as ComparableExpressionBase).asc()
        }

        val deckResults = query.selectFrom(deckQ)
                .where(predicate)
                .limit(filters.pageSize)
                .offset(filters.page * filters.pageSize)
                .apply {
                    if (filters.sort != DeckSortOptions.ADDED_DATE) {
                        orderBy(sort, deckQ.id.asc())
                    } else {
                        orderBy(sort)
                    }
                }
                .fetch()

        val decks = deckResults.map {
            val searchResult = it.toDeckSearchResult(cardService.deckSearchResultCardsFromCardIds(it.cardIds))
            if (filters.forSale || filters.forTrade) {
                searchResult.copy(deckSaleInfo = saleInfoForDeck(searchResult.keyforgeId))
            } else {
                searchResult
            }
        }

        val decksPage = DecksPage(
                decks,
                filters.page
        )

        if (filters == defaultFilters) {
            log.info("Caching first decks page.")
            firstPageCached = decksPage
        }
        if (filters == defaultFiltersSecondPage) {
            log.info("Caching second decks page.")
            secondPageCached = decksPage
        }
        if (filters == defaultFilters100Results) {
            log.info("Caching first decks page for 100 results.")
            firstPageCached100Results = decksPage
        }
        if (filters == defaultFiltersSecondPage100Results) {
            log.info("Caching second decks page for 100 results.")
            secondPageCached100Results = decksPage
        }

        return decksPage
    }

    private fun filtersAreEqualForCount(filters: DeckFilters) = filters.copy(
            sort = defaultFilters.sort,
            sortDirection = defaultFilters.sortDirection
    ) == defaultFilters

    private fun deckFilterPedicate(filters: DeckFilters): BooleanBuilder {
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()

        if (!filters.includeUnregistered) {
            predicate.and(deckQ.registered.isTrue)
        }

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
        if (filters.forSaleInCountry != null) {
            val preferredCountries = currentUserService.loggedInUser()?.preferredCountries
            if (preferredCountries.isNullOrEmpty()) {
                predicate.and(deckQ.userDecks.any().forSaleInCountry.eq(filters.forSaleInCountry))
            } else {
                predicate.andAnyOf(*preferredCountries.map { deckQ.userDecks.any().forSaleInCountry.eq(it) }.toTypedArray())
            }
        }
        if (filters.constraints.isNotEmpty()) {
            filters.constraints.forEach {
                if (it.property == "listedWithinDays") {
                    predicate.and(deckQ.userDecks.any().dateListed.gt(ZonedDateTime.now().minusDays(it.value.toLong())))
                } else {
                    val entityRef = if (it.property == "askingPrice") {
                        predicate.and(deckQ.userDecks.any().askingPrice.isNotNull)
                        deckQ.userDecks.any()
                    } else {
                        deckQ
                    }
                    val pathToVal = Expressions.path(Double::class.java, entityRef, it.property)
                    predicate.and(Expressions.predicate(if (it.cap == Cap.MIN) Ops.GOE else Ops.LOE, pathToVal, Expressions.constant(it.value)))
                }
            }
        }

        filters.cards.forEach {
            predicate.and(deckQ.cardNamesString.like("%${it.cardName}${it.quantity}%"))
        }

        return predicate
    }

    fun findByNameIgnoreCase(name: String) = deckRepo.findByNameIgnoreCase(name.toLowerCase())

    fun findDeckWithSynergies(keyforgeId: String): DeckWithSynergyInfo? {
        if (keyforgeId == "simple") {
            // quiet down the annoying constant errors
            return null
        }
        if (keyforgeId.length != 36) {
            throw BadRequestException("Request for deck with synergies with bad id: $keyforgeId")
        }
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
                        forSaleInCountry = it.forSaleInCountry,
                        askingPrice = it.askingPrice,
                        listingInfo = it.listingInfo,
                        externalLink = it.externalLink,
                        condition = it.condition!!,
                        dateListed = it.dateListed!!.toLocalDate(),
                        expiresAt = it.expiresAt?.toLocalDate(),
                        username = it.user.username,
                        publicContactInfo = it.user.publicContactInfo
                )
            }
        }.sortedByDescending { it.dateListed }
    }

}
