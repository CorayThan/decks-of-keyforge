package coraythan.keyswap.auctions.purchases

import coraythan.keyswap.Api
import coraythan.keyswap.auctions.DeckListingService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/purchases")
class PurchaseEndpoints(
        private val purchaseService: PurchaseService,
        private val deckListingService: DeckListingService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/secured")
    fun createPurchase(@RequestBody createPurchase: CreatePurchase) = deckListingService.createPurchase(createPurchase, createPurchase.sellerId == null)

    @GetMapping("/secured")
    fun findPurchases(@RequestHeader(value = "Timezone") offsetMinutes: Int) = purchaseService.findPurchases(offsetMinutes)

    @GetMapping("/stats")
    fun findPurchaseStats() = purchaseService.findPurchaseStats()
}

data class CreatePurchaseResult(
        val createdOrUpdated: Boolean,
        val message: String
)
