package coraythan.keyswap.keyforgeevents

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.nowLocal
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.patreon.levelAtLeast
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import javax.persistence.EntityManager

@Transactional
@Service
class KeyForgeEventService(
        private val keyForgeEventRepo: KeyForgeEventRepo,
        private val currentUserService: CurrentUserService,
        private val entityManager: EntityManager,
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val query = JPAQueryFactory(entityManager)

    fun searchEvents(filters: KeyForgeEventFilters): List<KeyForgeEventDto> {
        val eventQ = QKeyForgeEvent.keyForgeEvent
        val predicate = BooleanBuilder()
        val now = nowLocal()

        when (filters.timeRange) {
            EventTimeRange.PAST -> predicate.and(eventQ.startDateTime.before(now))
            EventTimeRange.FUTURE -> predicate.and(eventQ.startDateTime.after(now))
            EventTimeRange.NEXT_MONTH -> predicate.and(eventQ.startDateTime.between(now, now.plusMonths(1)))
            EventTimeRange.NEXT_THREE_MONTHS -> predicate.and(eventQ.startDateTime.between(now, now.plusMonths(3)))
        }

        if (filters.promoted) {
            predicate.and(eventQ.promoted.isTrue)
        }
        if (filters.sealed != null) {
            if (filters.sealed == true) {
                predicate.and(eventQ.sealed.isTrue)
            } else {
                predicate.and(eventQ.sealed.isFalse)
            }
        }
        if (filters.formats.isNotEmpty()) {
            predicate.and(eventQ.format.`in`(filters.formats))
        }

        return query.selectFrom(eventQ)
                .where(predicate)
                .orderBy(eventQ.startDateTime.asc())
                .fetch()
                .map { it.toDto() }
    }

    fun saveEvent(event: KeyForgeEventDto) {
        val user = currentUserService.hasPatronLevelOrUnauthorized(PatreonRewardsTier.NOTICE_BARGAINS)

        if (event.id != null) {
            val preexisting = keyForgeEventRepo.findByIdOrNull(event.id) ?: throw IllegalStateException("No keyforge event for id: ${event.id}")
            if (preexisting.createdBy.id != user.id) throw UnauthorizedException("You don't own keyforge event with id ${event.id}")

            val toUpdate = preexisting.copy(
                    name = event.name,
                    description = event.description,
                    startDateTime = event.startDateTime,
                    banner = event.banner,
                    entryFee = event.entryFee,
                    duration = event.duration,
                    signupLink = event.signupLink,
                    discordServer = event.discordServer,
                    online = event.online,
                    sealed = event.sealed,
                    format = event.format,
                    country = event.country,
                    state = event.state,
                    promoted = user.realPatreonTier()?.levelAtLeast(PatreonRewardsTier.SUPPORT_SOPHISTICATION) ?: false
            )

            keyForgeEventRepo.save(toUpdate)
        } else {
            val toSave = KeyForgeEvent(
                    name = event.name,
                    description = event.description,
                    startDateTime = event.startDateTime,
                    banner = event.banner,
                    entryFee = event.entryFee,
                    duration = event.duration,
                    signupLink = event.signupLink,
                    discordServer = event.discordServer,
                    online = event.online,
                    sealed = event.sealed,
                    format = event.format,
                    country = event.country,
                    state = event.state,
                    createdBy = user,
                    promoted = user.realPatreonTier()?.levelAtLeast(PatreonRewardsTier.SUPPORT_SOPHISTICATION) ?: false,
            )

            keyForgeEventRepo.save(toSave)
        }
    }

    fun deleteEvent(eventId: Long) = keyForgeEventRepo.deleteById(eventId)

    fun updatePromotedEventsForUser(user: KeyUser) {
        val events = keyForgeEventRepo.findByCreatedById(user.id)
        val promoted = user.realPatreonTier()?.levelAtLeast(PatreonRewardsTier.SUPPORT_SOPHISTICATION) ?: false

        events.forEach {
            if (promoted != it.promoted) {
                keyForgeEventRepo.save(it.copy(promoted = promoted))
            }
        }
    }

    fun addEventIcon(name: String, eventIcon: MultipartFile, extension: String) {
        // TODO Actually do this
    }

}
