package coraythan.keyswap.auctions

import coraythan.keyswap.Api
import coraythan.keyswap.userdeck.ListingInfo
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/auctions/secured")
class AuctionEndpoints(
        val auctionService: AuctionService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/list")
    fun list(@RequestBody listingInfo: ListingInfo) = auctionService.list(listingInfo)

    @PostMapping("/{id}/cancel")
    fun cancel(@PathVariable id: UUID) = auctionService.cancel(id)

    @PostMapping("/bid/{auctionId}/{bid}")
    fun bid(@PathVariable auctionId: UUID, @PathVariable bid: Int) = auctionService.bid(auctionId, bid)
}
