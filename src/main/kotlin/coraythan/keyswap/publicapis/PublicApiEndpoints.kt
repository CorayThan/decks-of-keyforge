package coraythan.keyswap.publicapis

import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardService
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

val maxApiRequests = 25

@RestController
@RequestMapping("/public-api")
class PublicApiEndpoints(
        private val publicApiService: PublicApiService,
        private val statsService: StatsService,
        private val cardService: CardService
) {

    @Scheduled(fixedDelayString = "PT1M")
    fun clearPublicRateLimiters() {
        try {
            this.rateLimiters.clear()
        } catch (e: Throwable) {
            log.error("$scheduledException clearing rate limiters", e)
        }
    }

    private val rateLimiters = ConcurrentHashMap<String, Int>()

    private val dontRateLimitEmails = listOf("detour27@gmail.com", "skyjedi@gmail.com")

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/api-keys/secured")
    fun generateApiKey() = publicApiService.generateApiKey()

    @CrossOrigin
    @GetMapping("/v3/decks/{id}")
    fun findDeckSimple3(@RequestHeader("Api-Key") apiKey: String, @PathVariable id: String): SimpleDeckResponse {

        this.rateLimit(apiKey)

        val deck = publicApiService.findDeckSimple(id)
        return SimpleDeckResponse(deck ?: Nothing())
    }

    @CrossOrigin
    @GetMapping("/v1/stats")
    fun findStats1(@RequestHeader("Api-Key") apiKey: String): DeckStatistics {

        this.rateLimit(apiKey)

        val user = publicApiService.userForApiKey(apiKey)
        log.info("Deck stats request from user ${user.email}")
        return statsService.findCurrentStats() ?: throw BadRequestException("Sorry, deck statistics are not available at this time.")
    }

    @CrossOrigin
    @GetMapping("/v1/cards")
    fun findCards1(@RequestHeader("Api-Key") apiKey: String): List<Card> {

        this.rateLimit(apiKey)

        val user = publicApiService.userForApiKey(apiKey)
        log.info("Cards request from user ${user.email}")
        return cardService.allFullCardsNonMaverickNoDups()
    }

    @CrossOrigin
    @GetMapping("/v1/my-decks")
    fun findMyDecks(@RequestHeader("Api-Key") apiKey: String): List<PublicMyDeckInfo> {
        this.rateLimit(apiKey)
        val user = publicApiService.userForApiKey(apiKey)

        return publicApiService.findMyDecks(user)
    }

    private fun rateLimit(apiKey: String) {
        val requests = this.rateLimiters.getOrPut(apiKey, { 0 }) + 1
        this.rateLimiters[apiKey] = requests

        if (requests > maxApiRequests) {
            val user = publicApiService.userForApiKey(apiKey)
            val realMaxRequests = user.realPatreonTier()?.maxApiRequests ?: maxApiRequests
            if (requests > realMaxRequests) {
                val userEmail = user.email
                if (realMaxRequests + 1 == requests) log.warn("The user $userEmail sent too many requests.")
                if (!dontRateLimitEmails.contains(userEmail)) {
                    throw RateExceededException(
                            "You've sent too many requests in the last minute. You've sent $requests in the last minute. Decks of KeyForge has been taken down " +
                                    "by this type of activity in the past. If you need to know the SAS for all decks, I provide a CSV file you should use for " +
                                    "that purpose. Otherwise, please contact me on discord, or at decksofkeyforge@gmail.com"
                    )
                }
            }
        }
    }
}
