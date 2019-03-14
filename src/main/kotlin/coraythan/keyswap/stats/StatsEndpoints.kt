package coraythan.keyswap.stats

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/stats")
class StatsEndpoints(
        val statsService: StatsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun findGlobalStats() = statsService.findGlobalStats()

    @PostMapping("/start-new")
    fun startNewStats(@RequestParam apiKey: String) {

        check(apiKey == "crazybunnypantssalad") {
            "Wrong api key! it was $apiKey"
        }

        statsService.startNewDeckStats()
    }
}
