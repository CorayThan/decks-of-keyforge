package coraythan.keyswap.users.search

import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Predicate
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.tokenize
import coraythan.keyswap.userdeck.OwnedDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import coraythan.keyswap.users.QKeyUser
import jakarta.persistence.EntityManager
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.Instant
import kotlin.system.measureTimeMillis

const val lockUpdateUserSearchStatsFor = "PT1M"

@Service
@Transactional
class UserSearchService(
        private val ownedDeckRepo: OwnedDeckRepo,
        private val userRepo: KeyUserRepo,
        private val currentUserService: CurrentUserService,
        private val entityManager: EntityManager
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val query = JPAQueryFactory(entityManager)

    var allSearchableUsers: List<UserSearchResult> = listOf()
    var lastUserSearchUpdate: Instant = Instant.now()

    @Scheduled(fixedDelayString = lockUpdateUserSearchStatsFor, initialDelayString = SchedulingConfig.updateUserStatsInitialDelay)
    @SchedulerLock(name = "updateUserStats", lockAtLeastFor = lockUpdateUserSearchStatsFor, lockAtMostFor = lockUpdateUserSearchStatsFor)
    fun updateUserStats() {
        try {
            log.info("$scheduledStart update user stats.")
            var count: Int
            var generationTime: Long = 0
            val userUpdateTime = measureTimeMillis {
                val users = userRepo.findTop100ByUpdateStatsTrue()
                count = users.size
                users
                        .forEach {
                            var dataNullable: UserSearchResult?
                            val singleGenTime = measureTimeMillis {
                                val ownedDecks = ownedDeckRepo.findAllByOwnerId(it.id).map { it.deck }
                                dataNullable = it.generateSearchResult(ownedDecks)
                            }
                            val data = dataNullable!!
                            generationTime += singleGenTime
                            userRepo.updateUserStats(
                                    it.id,
                                    data.deckCount,
                                    data.forSaleCount,
                                    data.topSasAverage,
                                    data.highSas,
                                    data.lowSas,
                                    data.totalPower,
                                    data.totalChains,
                                    data.mavericks,
                                    data.anomalies
                            )
                        }
            }

            this.updateSearchResults()

            log.info("$scheduledStop Updated $count users in $userUpdateTime ms gen time $generationTime ms")
        } catch (e: Throwable) {
            log.error("$scheduledException updating stats for users", e)
        }
    }

    fun currentSearchResults() = UserSearchResults(
            updatedMinutesAgo = Duration.between(this.lastUserSearchUpdate, Instant.now()).abs().toMinutes(),
            users = this.allSearchableUsers
    )

    fun updateSearchResults() {
        allSearchableUsers = searchUsers(UserFilters())
        lastUserSearchUpdate = Instant.now()
    }

    fun scheduleUserForUpdate(user: KeyUser) {
        userRepo.setUpdateUserTrue(user.id)
    }

    fun findStatsForUser(username: String): UserSearchResult? {
        return searchUsers(UserFilters(username = username)).getOrNull(0)
    }

    fun searchUsers(filters: UserFilters, withHidden: Boolean = false): List<UserSearchResult> {
        val userQ = QKeyUser.keyUser
        val predicate = userFilterPredicate(filters, withHidden)

        val sort = when (filters.sort) {
            UserSort.RATING ->
                userQ.rating.desc()
            UserSort.DECK_COUNT ->
                userQ.deckCount.desc()
            UserSort.SAS_AVERAGE ->
                userQ.topSasAverage.desc()
            UserSort.TOP_SAS ->
                userQ.highSas.desc()
            UserSort.LOW_SAS ->
                userQ.lowSas.asc()
            UserSort.FOR_SALE_COUNT ->
                userQ.forSaleCount.desc()
            UserSort.PATRON_LEVEL ->
                userQ.patreonTier.desc()
            UserSort.TOTAL_POWER ->
                userQ.totalPower.desc()
            UserSort.TOTAL_CHAINS ->
                userQ.totalChains.desc()
            UserSort.USER_NAME ->
                userQ.username.asc()
        }

        return query
                .select(
                        Projections.constructor(UserSearchResult::class.java,
                                userQ.id, userQ.username, userQ.rating, userQ.deckCount, userQ.forSaleCount, userQ.topSasAverage, userQ.highSas, userQ.lowSas, userQ.totalPower,
                                userQ.totalChains, userQ.mavericks, userQ.anomalies, userQ.type, userQ.patreonTier, userQ.manualPatreonTier, userQ.teamId, userQ.allowUsersToSeeDeckOwnership
                        )
                )
                .from(userQ)
                .where(predicate)
                .orderBy(sort)
                .fetch()
                .filter { it.deckCount != 0 }
    }

    private fun userFilterPredicate(filters: UserFilters, withHidden: Boolean = false): Predicate {
        val userQ = QKeyUser.keyUser
        val predicate = BooleanBuilder()

        if (withHidden) {
            currentUserService.adminOrUnauthorized()
        } else {
            predicate.and(userQ.allowUsersToSeeDeckOwnership.isTrue)
        }

        when (filters.sort) {
            UserSort.DECK_COUNT ->
                predicate.and(userQ.deckCount.gt(0))
            UserSort.SAS_AVERAGE ->
                predicate.and(userQ.deckCount.gt(0))
            UserSort.TOP_SAS ->
                predicate.and(userQ.deckCount.gt(0))
            UserSort.LOW_SAS ->
                predicate.and(userQ.deckCount.gt(0))
            UserSort.FOR_SALE_COUNT ->
                predicate.and(userQ.forSaleCount.gt(0))
            UserSort.PATRON_LEVEL ->
                predicate.and(userQ.patreonTier.isNotNull)
            UserSort.TOTAL_POWER ->
                predicate.and(userQ.totalPower.gt(0))
            UserSort.TOTAL_CHAINS ->
                predicate.and(userQ.totalChains.gt(0))
            else -> {
                // do nothing
            }
        }

        if (!filters.username.isBlank()) {
            filters.username.tokenize().forEach { predicate.and(userQ.username.likeIgnoreCase("%$it%")) }
        }

        return predicate
    }
}
