package coraythan.keyswap

import java.time.LocalDate
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*

object TimeUtils {

    val zoneId: ZoneId

    init {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
        zoneId = ZoneId.systemDefault()
    }

    fun nowAsDate(): Date = Date.from(now().toInstant())

}

fun now() = ZonedDateTime.now(TimeUtils.zoneId)

fun ZonedDateTime.toLocalDateWithOffsetMinutes(offsetMinutes: Int): LocalDate {
    return toOffsetDateTime().withOffsetSameInstant(ZoneOffset.ofHoursMinutes(offsetMinutes / 60, offsetMinutes % 60)).toLocalDate()
}
