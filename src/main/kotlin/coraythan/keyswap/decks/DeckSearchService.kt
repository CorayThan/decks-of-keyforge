package coraythan.keyswap.decks

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Ops
import com.querydsl.core.types.dsl.ComparableExpressionBase
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.JPAExpressions
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.House
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.auctions.QDeckListing
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.models.*
import coraythan.keyswap.now
import coraythan.keyswap.stats.StatsService
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.tokenize
import coraythan.keyswap.userdeck.QUserDeck
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.EntityManager

@Transactional
@Service
class DeckSearchService(
        private val cardService: CardService,
        private val deckRepo: DeckRepo,
        private val userService: KeyUserService,
        private val currentUserService: CurrentUserService,
        private val statsService: StatsService,
        private val userDeckRepo: UserDeckRepo,
        private val deckWinsService: DeckWinsService,
        private val entityManager: EntityManager
) {
    private val log = LoggerFactory.getLogger(this::class.java)
    private val defaultFilters = DeckFilters()
    private val query = JPAQueryFactory(entityManager)

    var deckCount: Long? = null

    fun countFilters(filters: DeckFilters): DeckCount {

        val count: Long
        val preExistingCount = deckCount
        if (preExistingCount != null && filtersAreEqualForCount(filters)
                && filters.sort != DeckSortOptions.CHAINS && filters.sort != DeckSortOptions.POWER_LEVEL) {
            count = preExistingCount
        } else {

            val userHolder = UserHolder(null, currentUserService, userService)
            val predicate = deckFilterPredicate(filters, userHolder, filters.sort)

            if (filtersAreEqualForCount(filters) && filters.sort != DeckSortOptions.CHAINS && filters.sort != DeckSortOptions.POWER_LEVEL) {

                count = deckRepo.countByRegisteredTrue()
                deckCount = count

            } else {

                val deckQ = QDeck.deck
                count = query
                        .select(deckQ.id)
                        .from(deckQ)
                        .where(predicate)
                        .limit(if (
                                filters.forSale == true || filters.forTrade || filters.forAuction
                        ) 10000 else 1000)
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

    fun filterDecks(filters: DeckFilters, timezoneOffsetMinutes: Int): DecksPage {

        val userHolder = UserHolder(null, currentUserService, userService)
        val predicate = deckFilterPredicate(filters, userHolder, filters.sort)
        val deckQ = QDeck.deck
        val sortProperty = when (filters.sort) {
            DeckSortOptions.ADDED_DATE -> deckQ.id
            DeckSortOptions.AERC_SCORE -> deckQ.aercScore
            DeckSortOptions.POWER_LEVEL -> deckQ.powerLevel
            DeckSortOptions.CHAINS -> deckQ.chains
            DeckSortOptions.SAS_RATING -> deckQ.sasRating
            DeckSortOptions.FUNNIEST -> deckQ.funnyCount
            DeckSortOptions.MOST_WISHLISTED -> deckQ.wishlistCount
            DeckSortOptions.NAME -> deckQ.name
            DeckSortOptions.RECENTLY_LISTED -> deckQ.listedOn
            DeckSortOptions.ENDING_SOONEST -> deckQ.auctionEnd
            DeckSortOptions.COMPLETED_RECENTLY -> deckQ.auctionEndedOn
        }

        val sort = if (
                filters.sort == DeckSortOptions.ENDING_SOONEST
        ) {
            if (filters.sortDirection == SortDirection.ASC) {
                (sortProperty as ComparableExpressionBase<*>).desc()
            } else {
                (sortProperty as ComparableExpressionBase<*>).asc()
            }
        } else if (
                filters.sortDirection == SortDirection.DESC
                || filters.sort == DeckSortOptions.FUNNIEST
                || filters.sort == DeckSortOptions.MOST_WISHLISTED
                || filters.sort == DeckSortOptions.RECENTLY_LISTED
        ) {
            (sortProperty as ComparableExpressionBase<*>).desc()
        } else {
            (sortProperty as ComparableExpressionBase<*>).asc()
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
            val cards = cardService.cardsForDeck(it)
            val searchResult = it.toDeckSearchResult(
                    cardService.deckSearchResultCardsFromCardIds(it.cardIds),
                    cards,
                    stats = statsService.findCurrentStats(),
                    crucibleWins = deckWinsService.crucibleWins,
                    synergies = DeckSynergyService.fromDeckWithCards(it, cards)
            )
            if (filters.forSale == true || filters.forTrade || filters.forAuction) {
                searchResult.copy(deckSaleInfo = saleInfoForDeck(
                        searchResult.keyforgeId,
                        timezoneOffsetMinutes,
                        it,
                        userHolder.user,
                        filters.completedAuctions
                ))
            } else if (filters.withOwners) {
                if (userHolder.user?.email != "coraythan@gmail.com") throw BadRequestException("You do not have permission to see owners.")
                searchResult.copy(owners = userDeckRepo.findByDeckIdAndOwnedByNotNull(it.id).mapNotNull { userDeck ->
                    userDeck.ownedBy
                })
            } else {
                searchResult
            }
        }

        return DecksPage(
                decks,
                filters.page
        )
    }

    private fun filtersAreEqualForCount(filters: DeckFilters) = filters.copy(
            sort = defaultFilters.sort,
            sortDirection = defaultFilters.sortDirection
    ) == defaultFilters

    data class UserHolder(private val id: UUID? = null, private val currentUserService: CurrentUserService, private val userService: KeyUserService) {
        val user: KeyUser? by lazy {
            if (id == null) currentUserService.loggedInUser() else userService.findByIdOrNull(id)
        }
    }

    fun deckFilterPredicate(filters: DeckQuery, userHolder: UserHolder, sortOptions: DeckSortOptions? = null): BooleanBuilder {
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()

        if (sortOptions == DeckSortOptions.POWER_LEVEL) {
            predicate.and(deckQ.powerLevel.gt(0))
        }
        if (sortOptions == DeckSortOptions.CHAINS) {
            predicate.and(deckQ.chains.gt(0))
        }

        if (filters.registered == false) {
            predicate.and(deckQ.registered.isFalse)
        } else {
            predicate.and(deckQ.registered.isTrue)
        }

        if (filters.expansions.isNotEmpty()) {
            predicate.andAnyOf(*filters.expansions.map { deckQ.expansion.eq(it) }.toTypedArray())
        }

        if (filters.houses.isNotEmpty()) {
            if (filters.houses.size < 4) {
                filters.houses.forEach { predicate.and(deckQ.houseNamesString.like("%$it%")) }
            } else {
                val excludeHouses = House.values().filter { !filters.houses.contains(it) }
                excludeHouses.forEach { predicate.and(deckQ.houseNamesString.notLike("%$it%")) }
            }
        }

        if (filters.title.isNotBlank()) {
            filters.title.tokenize().forEach { predicate.and(deckQ.name.likeIgnoreCase("%$it%")) }
        }
        if (filters.notes.isNotBlank()) {
            val username = if (filters.notesUser.isNotBlank()) {
                filters.notesUser
            } else {
                userHolder.user?.username
            } ?: throw IllegalArgumentException("No notes user for notes.")

            val trimmed = filters.notes.toLowerCase().trim()
            val userDeckQ = QUserDeck.userDeck
            predicate.and(
                    deckQ.userDecks.any().`in`(
                            JPAExpressions.selectFrom(userDeckQ)
                                    .where(
                                            userDeckQ.user.username.eq(username),
                                            userDeckQ.notes.containsIgnoreCase(trimmed)
                                    )
                    )
            )
        }
        if (filters.owner.isNotBlank()) {
            val username = userHolder.user?.username
            if (username == filters.owner) {
                // it's me
                predicate.and(deckQ.userDecks.any().ownedBy.eq(username))
            } else {
                val allowToSeeAllDecks = userService.findUserByUsername(filters.owner)?.allowUsersToSeeDeckOwnership ?: false

                if (allowToSeeAllDecks) {
                    predicate.and(deckQ.userDecks.any().ownedBy.eq(filters.owner))
                } else {
                    val deckListingQ = QDeckListing.deckListing
                    predicate.and(
                            deckQ.auctions.any().`in`(
                                    JPAExpressions.selectFrom(deckListingQ)
                                            .where(
                                                    deckListingQ.seller.username.eq(filters.owner),
                                                    deckListingQ.status.ne(DeckListingStatus.COMPLETE)
                                            )
                            )
                    )
                }
            }
        }
        if (filters.myFavorites) {
            val favsUserId = userHolder.user?.id
            if (favsUserId != null) {
                val userDeckQ = QUserDeck.userDeck
                predicate.and(
                        deckQ.userDecks.any().`in`(
                                JPAExpressions.selectFrom(userDeckQ)
                                        .where(
                                                userDeckQ.user.id.eq(favsUserId),
                                                userDeckQ.wishlist.isTrue
                                        )
                        )
                )
            }
        }
        if (filters.completedAuctions) {
            predicate.and(deckQ.completedAuction.isTrue)
        } else if (filters.forSale == false) {
            predicate.and(deckQ.forSale.isFalse)
            predicate.and(deckQ.forTrade.isFalse)
            predicate.and(deckQ.forAuction.isFalse)
        } else {
            if (filters.forSale == true) {
                predicate.and(deckQ.forSale.isTrue)
            } else if (filters.forTrade || filters.forAuction) {
                predicate.and(BooleanBuilder().andAnyOf(
                        *listOfNotNull(
                                if (filters.forTrade) deckQ.forTrade.isTrue else null,
                                if (filters.forAuction) deckQ.forAuction.isTrue else null
                        ).toTypedArray()
                ))
            }
            if (filters.forSaleInCountry != null) {
                val preferredCountries = userHolder.user?.preferredCountries
                if (preferredCountries.isNullOrEmpty()) {
                    predicate.and(
                            deckQ.auctions.any().forSaleInCountry.eq(filters.forSaleInCountry)
                    )
                } else {
                    predicate.andAnyOf(*preferredCountries.map {
                        deckQ.auctions.any().forSaleInCountry.eq(it)
                    }.toTypedArray())
                }
            }
        }
        if (filters.constraints.isNotEmpty()) {
            filters.constraints.forEach {
                if (it.property == "listedWithinDays") {
                    predicate.and(deckQ.auctions.any().dateListed.gt(now().minusDays(it.value.toLong())))
                } else {
                    val pathToVal = if (it.property == "buyItNow") {
                        Expressions.path(Double::class.java, deckQ.auctions.any(), it.property)
                    } else {
                        Expressions.path(Double::class.java, deckQ, it.property)
                    }
                    predicate.and(Expressions.predicate(if (it.cap == Cap.MIN) Ops.GOE else Ops.LOE, pathToVal, Expressions.constant(it.value)))
                }
            }
        }

        filters.cards.forEach {
            when {
                it.house != null -> predicate.andAnyOf(
                        *it.cardNames.map { cardName ->
                            deckQ.cardNames.like("%~$cardName${it.house}~%")
                        }.toTypedArray()
                )
                it.quantity == 0 -> it.cardNames.forEach { cardName ->
                    predicate.and(deckQ.cardNames.notLike("%~${cardName}1%"))
                }
                else -> predicate.andAnyOf(
                        *it.cardNames.map { cardName ->
                            deckQ.cardNames.like("%~$cardName${(1..it.quantity).joinToString("")}%")
                        }.toTypedArray()
                )
            }
        }

        return predicate
    }

    fun randomDeckId(): String {
        val deckOffset = (0..(deckCount ?: 800000)).random()
        val deckQ = QDeck.deck
        return query
                .select(deckQ.keyforgeId)
                .from(deckQ)
                .where(BooleanBuilder().and(deckQ.registered.isTrue).and(deckQ.id.gt(deckOffset)))
                .limit(1)
                .orderBy(deckQ.id.asc())
                .fetchFirst()
    }

    fun findByNameIgnoreCase(name: String) = deckRepo.findByNameIgnoreCase(name.toLowerCase())

    fun findDeckSearchResultWithCards(keyforgeId: String): DeckSearchResult {
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: throw BadRequestException("No deck with id $keyforgeId")
        return deck.toDeckSearchResult(
                cardService.deckSearchResultCardsFromCardIds(deck.cardIds),
                cardService.cardsForDeck(deck),
                stats = statsService.findCurrentStats())
    }

    fun findDeckWithSynergies(keyforgeId: String): DeckWithSynergyInfo? {
        if (keyforgeId == "simple") {
            // quiet down the annoying constant errors
//            log.warn("Still receiving dumb simple deck requests.")
            return null
        }
        if (keyforgeId.length != 36) {
            throw BadRequestException("Request for deck with synergies with bad id: $keyforgeId")
        }
        val deck = deckRepo.findByKeyforgeId(keyforgeId) ?: return null
        return deckToDeckWithSynergies(deck)
    }

    fun deckToDeckWithSynergies(deck: Deck): DeckWithSynergyInfo {
        val stats = statsService.findCurrentStats()
        val cards = cardService.cardsForDeck(deck)
        return DeckWithSynergyInfo(
                deck = deck.toDeckSearchResult(
                        cardService.deckSearchResultCardsFromCardIds(deck.cardIds),
                        cards,
                        stats = stats,
                        crucibleWins = deckWinsService.crucibleWins,
                        synergies = DeckSynergyService.fromDeckWithCards(deck, cards)
                ),
                synergyPercentile = stats?.synergyStats?.percentileForValue?.get(deck.synergyRating) ?: -1.0,
                antisynergyPercentile = stats?.antisynergyStats?.percentileForValue?.get(deck.antisynergyRating) ?: -1.0
        )
    }

    fun saleInfoForDeck(keyforgeId: String, offsetMinutes: Int, deckParam: Deck? = null, userParam: KeyUser? = null, completedAuctionsOnly: Boolean = false): List<DeckSaleInfo> {
        val deck = deckParam ?: deckRepo.findByKeyforgeId(keyforgeId) ?: return listOf()
        val currentUser = userParam ?: currentUserService.loggedInUser()

        val mapped = if (completedAuctionsOnly) {
            deck.auctions.filter { it.status == DeckListingStatus.COMPLETE }
                    .map { DeckSaleInfo.fromAuction(offsetMinutes, it, currentUser) }
        } else {
            deck.auctions.filter { it.status != DeckListingStatus.COMPLETE }
                    .map { DeckSaleInfo.fromAuction(offsetMinutes, it, currentUser) }
        }

        return mapped
                .sortedByDescending { it.dateListed }
    }

    fun findDecksByName(name: String): List<DeckSearchResult> {
        val deckQ = QDeck.deck
        val predicate = BooleanBuilder()
        val trimmed = name
                .toLowerCase()
                .trim()
        val tokenized = trimmed
                .split("\\W+".toRegex())
                .filter { it.length > 2 }

        val toUse = if (tokenized.isEmpty()) listOf(trimmed) else tokenized
        toUse.forEach { predicate.and(deckQ.name.likeIgnoreCase("%$it%")) }

        return query.selectFrom(deckQ)
                .where(predicate)
                .limit(5)
                .fetch()
                .map {
                    val cards = cardService.cardsForDeck(it)
                    it.toDeckSearchResult(
                            stats = statsService.findCurrentStats(),
                            synergies = DeckSynergyService.fromDeckWithCards(it, cards)
                    )
                }
    }

}
