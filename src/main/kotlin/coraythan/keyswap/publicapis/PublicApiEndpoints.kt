package coraythan.keyswap.publicapis

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.Nothing
import coraythan.keyswap.decks.SimpleDeckResponse
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.stats.StatsService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/public-api")
class PublicApiEndpoints(
        private val publicApiService: PublicApiService,
        private val statsService: StatsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/api-keys/secured")
    fun generateApiKey() = publicApiService.generateApiKey()

    @PostMapping("/sellers/list-deck")
    fun listDeckForSale(@RequestHeader("Api-Key") apiKey: String, @RequestBody listDeck: ListDeck) {
        val seller = publicApiService.userForApiKey(apiKey)
        log.info("List deck request from ${seller.email}")
        publicApiService.listDeckForSeller(listDeck, seller)
    }

    @DeleteMapping("/sellers/unlist-deck/{id}")
    fun unlistDeck(@RequestHeader("Api-Key") apiKey: String, @PathVariable id: String) {
        val seller = publicApiService.userForApiKey(apiKey)
        log.info("Unlist deck request from ${seller.email}")
        publicApiService.unlistDeckForSeller(id, seller)
    }

    @DeleteMapping("/sellers/unlist-deck-by-name/{name}")
    fun unlistDeckWithName(@RequestHeader("Api-Key") apiKey: String, @PathVariable name: String) {
        val seller = publicApiService.userForApiKey(apiKey)
        log.info("Unlist deck with name request from ${seller.email}")
        publicApiService.unlistDeckForSellerWithName(name, seller)
    }

    @CrossOrigin
    @GetMapping("/v3/decks/{id}")
    fun findDeckSimple3(@RequestHeader("Api-Key") apiKey: String, @PathVariable id: String): SimpleDeckResponse {
        val user = publicApiService.userForApiKey(apiKey)
        log.info("Simple deck request from user ${user.email}")
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
