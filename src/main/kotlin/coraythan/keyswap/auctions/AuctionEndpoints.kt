package coraythan.keyswap.auctions

import coraythan.keyswap.Api
import coraythan.keyswap.userdeck.ListingInfo
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/auctions")
class AuctionEndpoints(
        val auctionService: AuctionService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/secured/list")
    fun list(@RequestBody listingInfo: ListingInfo, @RequestHeader(value = "Timezone") offsetMinutes: Int)
            = auctionService.list(listingInfo, offsetMinutes)

    @PostMapping("/secured/cancel/{deckId}")
    fun cancel(@PathVariable deckId: Long) = auctionService.cancel(deckId)

    @PostMapping("/secured/bid/{auctionId}/{bid}")
    fun bid(@PathVariable auctionId: UUID, @PathVariable bid: Int) = auctionService.bid(auctionId, bid)

    @PostMapping("/secured/buy-it-now/{auctionId}")
    fun buyItNow(@PathVariable auctionId: UUID) = auctionService.buyItNow(auctionId)

    @GetMapping("/{auctionId}")
    fun auctionInfo(@PathVariable auctionId: UUID, @RequestHeader(value = "Timezone") offsetMinutes: Int)
            = auctionService.auctionInfo(auctionId, offsetMinutes)

}