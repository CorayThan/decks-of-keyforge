package coraythan.keyswap

import java.time.*
import java.time.format.DateTimeFormatter
import java.util.*

object TimeUtils {

    val zoneId: ZoneId

    val localDateTimeFormatter = DateTimeFormatter.ofPattern("MMM d, h:mm a")
    val localDateTimeFormatterWithSeconds = DateTimeFormatter.ofPattern("MMM d, h:mm:ss a")

    init {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
        zoneId = ZoneId.systemDefault()
    }

    fun nowAsDate(): Date = Date.from(now().toInstant())

}

fun now() = ZonedDateTime.now(TimeUtils.zoneId)

fun ZonedDateTime.toLocalDateTimeWithOffsetMinutes(offsetMinutes: Int): LocalDateTime {
    return toOffsetDateTime().withOffsetSameInstant(ZoneOffset.ofHoursMinutes(offsetMinutes / 60, offsetMinutes % 60)).toLocalDateTime()
}

fun ZonedDateTime.toLocalDateWithOffsetMinutes(offsetMinutes: Int): LocalDate {
    return toLocalDateTimeWithOffsetMinutes(offsetMinutes).toLocalDate()
}

fun ZonedDateTime.toReadableStringWithOffsetMinutes(offsetMinutes: Int, format: DateTimeFormatter = TimeUtils.localDateTimeFormatter): String {
    return toLocalDateTimeWithOffsetMinutes(offsetMinutes).format(format)
}
