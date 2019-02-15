package coraythan.keyswap.sellers

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/sellers")
class SellerEndpoints(
        private val sellerService: SellerService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/secured")
    fun generateSellerApiKey() = sellerService.generateApiKey()

    @PostMapping("/list-deck")
    fun listDeckForSale(@RequestHeader("Api-Key") apiKey: String, @RequestBody listDeck: ListDeck) {
        val seller = sellerService.sellerForApiKey(apiKey)
        sellerService.listDeckForSeller(listDeck, seller)
    }

    @DeleteMapping("/unlist-deck/{id}")
    fun unlistDeck(@RequestHeader("Api-Key") apiKey: String, @RequestParam id: String) {
        val seller = sellerService.sellerForApiKey(apiKey)
        sellerService.unlistDeckForSeller(id, seller)
    }

    @DeleteMapping("/unlist-deck-with-name/{name}")
    fun unlistDeckWithName(@RequestHeader("Api-Key") apiKey: String, @RequestParam name: String) {
        val seller = sellerService.sellerForApiKey(apiKey)
        sellerService.unlistDeckForSellerWithName(name, seller)
    }
}
