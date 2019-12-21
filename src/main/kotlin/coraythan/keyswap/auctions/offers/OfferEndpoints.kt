package coraythan.keyswap.auctions.offers

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/offers/secured")
class OfferEndpoints(
        val offerService: OfferService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/make-offer")
    fun makeOffer(@RequestBody makeOffer: MakeOffer) = offerService.makeOffer(makeOffer.auctionId, makeOffer.amount, makeOffer.message)

    @PostMapping("/cancel/{id}")
    fun cancel(@PathVariable id: UUID) = offerService.cancelOffer(id)

}
