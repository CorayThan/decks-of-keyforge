package coraythan.keyswap.keyforgeevents

import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*

interface KeyForgeEventRepo : CrudRepository<KeyForgeEvent, Long> {
    fun findByStartDateTimeBetween(start: LocalDateTime, end: LocalDateTime): List<KeyForgeEvent>
    fun findByCreatedById(id: UUID): List<KeyForgeEvent>
    fun findByTourneyId(id: Long): KeyForgeEvent?
}
