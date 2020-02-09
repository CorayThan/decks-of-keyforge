package coraythan.keyswap.publicapis

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.RateExceededException
import coraythan.keyswap.decks.Nothing
import coraythan.keyswap.decks.SimpleDeckResponse
import coraythan.keyswap.scheduledException
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.stats.StatsService
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.web.bind.annotation.*
import java.util.concurrent.ConcurrentHashMap

@RestController
@RequestMapping("/public-api")
class PublicApiEndpoints(
        private val publicApiService: PublicApiService,
        private val statsService: StatsService
) {

    @Scheduled(fixedDelayString = "PT1M")
    fun clearPublicRateLimiters() {
        try {
            this.rateLimiters.clear()
        } catch (e: Throwable) {
            log.error("$scheduledException clearing rate limiters")
        }
    }

    private val rateLimiters = ConcurrentHashMap<String, Int>()

    private val dontRateLimitEmails = listOf("detour27@gmail.com", "skyjedi@gmail.com")

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/api-keys/secured")
    fun generateApiKey() = publicApiService.generateApiKey()

    @PostMapping("/sellers/list-deck")
    fun listDeckForSale(@RequestHeader("Api-Key") apiKey: String, @RequestBody listDeck: ListDeck): String {
        return "This feature has been turned off. Let me know if you still want to use it!"
//        val seller = publicApiService.userForApiKey(apiKey)
//        log.info("List deck request from ${seller.email}")
//        publicApiService.listDeckForSeller(listDeck, seller)
    }

//    @DeleteMapping("/sellers/unlist-deck/{id}")
//    fun unlistDeck(@RequestHeader("Api-Key") apiKey: String, @PathVariable id: String) {
//        val seller = publicApiService.userForApiKey(apiKey)
//        log.info("Unlist deck request from ${seller.email}")
//        publicApiService.unlistDeckForSeller(id, seller)
//    }
//
//    @DeleteMapping("/sellers/unlist-deck-by-name/{name}")
//    fun unlistDeckWithName(@RequestHeader("Api-Key") apiKey: String, @PathVariable name: String) {
//        val seller = publicApiService.userForApiKey(apiKey)
//        log.info("Unlist deck with name request from ${seller.email}")
//        publicApiService.unlistDeckForSellerWithName(name, seller)
//    }

    @CrossOrigin
    @GetMapping("/v3/decks/{id}")
    fun findDeckSimple3(@RequestHeader("Api-Key") apiKey: String, @PathVariable id: String): SimpleDeckResponse {
        val requests = this.rateLimiters.getOrPut(apiKey, { 0 }) + 1
        this.rateLimiters[apiKey] = requests

        if (requests > 25) {
            val userEmail = publicApiService.userForApiKey(apiKey).email
            if (requests in 26..27) log.warn("The user $userEmail sent too many requests.")
            if (!dontRateLimitEmails.contains(userEmail)) {
                throw RateExceededException(
                        "You've sent too many requests in the last minute. You've sent $requests in the last minute. Decks of KeyForge has been taken down " +
                                "by this type of activity in the past. If you need to know the SAS for all decks, I provide a CSV file you should use for " +
                                "that purpose. Otherwise, please contact me on discord, or at decksofkeyforge@gmail.com"
                )
            }
        }

        val deck = publicApiService.findDeckSimple(id)
        return SimpleDeckResponse(deck ?: Nothing())
    }

    @CrossOrigin
    @GetMapping("/v1/stats")
    fun findStats1(@RequestHeader("Api-Key") apiKey: String): DeckStatistics {
        val user = publicApiService.userForApiKey(apiKey)
        log.info("Deck stats request from user ${user.email}")
        return statsService.findCurrentStats() ?: throw BadRequestException("Sorry, deck statistics are not available at this time.")
    }
}
