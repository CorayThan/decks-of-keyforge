package coraythan.keyswap

import java.time.ZoneId
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
