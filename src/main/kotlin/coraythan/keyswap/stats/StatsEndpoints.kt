package coraythan.keyswap.stats

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/stats")
class StatsEndpoints(
        val statsService: StatsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun findGlobalStats() = statsService.findGlobalStats()
}
