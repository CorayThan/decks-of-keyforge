package coraythan.keyswap.config

import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.filter.Filter
import ch.qos.logback.core.spi.FilterReply

class IgnoreLogsFilter : Filter<ILoggingEvent>() {

    override fun decide(event: ILoggingEvent?): FilterReply {
        if (event != null && event.message.contains("Invalid cookie header")) return FilterReply.DENY
        return FilterReply.ACCEPT
    }

}