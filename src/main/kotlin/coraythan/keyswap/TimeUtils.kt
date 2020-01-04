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
fun nowLocal() = LocalDateTime.now()

fun LocalTime.withOffsetMinutes(offsetMinutes: Int): LocalTime {
    return minusMinutes(offsetMinutes.toLong())
}

fun LocalDateTime.toReadableStringWithOffsetMinutes(offsetMinutes: Int, format: DateTimeFormatter = TimeUtils.localDateTimeFormatter): String {
    return this.atZone(TimeUtils.zoneId).toReadableStringWithOffsetMinutes(offsetMinutes, format)
}

fun ZonedDateTime.toLocalDateTimeWithOffsetMinutes(offsetMinutes: Int): LocalDateTime {
    return toOffsetDateTime().withOffsetSameInstant(ZoneOffset.ofHoursMinutes(offsetMinutes / 60, offsetMinutes % 60)).toLocalDateTime()
}

fun ZonedDateTime.toLocalDateWithOffsetMinutes(offsetMinutes: Int): LocalDate {
    return toLocalDateTimeWithOffsetMinutes(offsetMinutes).toLocalDate()
}

fun ZonedDateTime.toReadableStringWithOffsetMinutes(offsetMinutes: Int, format: DateTimeFormatter = TimeUtils.localDateTimeFormatter): String {
    return toLocalDateTimeWithOffsetMinutes(offsetMinutes).format(format)
}

fun Duration.toReadableString(): String {
    val days = this.toDays()
    val hours = this.minusDays(days).toHours()
    val minutes = this.minusDays(days).minusHours(hours).toMinutes()
    val readableDays = "$days ${if (days == 0L) "day" else "days"}"
    val readableHours = "$hours ${if (hours == 0L) "hour" else "hours"}"
    val readableMinutes = "$minutes ${if (minutes == 0L) "minute" else "minutes"}"
    if (days == 0L && hours == 0L) {
        return readableMinutes
    } else if (days == 0L) {
        return "$readableHours and $readableMinutes"
    } else {
        return "$readableDays, $readableHours and $readableMinutes"
    }
}
