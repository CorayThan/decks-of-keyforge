package coraythan.keyswap.stats

import coraythan.keyswap.Api
import coraythan.keyswap.security.SecretApiKeyValidator
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/stats")
class StatsEndpoints(
        val statsService: StatsService,
        val apiKeys: SecretApiKeyValidator
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping("/completed-date")
    fun findGlobalStatsCompletedDate() = statsService.findStatsCompleteDate()

    @GetMapping
    fun findGlobalStats() = statsService.findGlobalStats()

    @PostMapping
    fun setGlobalStatsManually(@RequestBody deckStats: DeckStatistics, @RequestParam apiKey: String) {
        apiKeys.checkApiKey(apiKey)
        return statsService.setStats(deckStats)
    }

    @PostMapping("/start-new")
    fun startNewStats() = statsService.startStatsManually()

    @GetMapping("/info")
    fun findStatsInfo() = statsService.findStatInfo()
}
