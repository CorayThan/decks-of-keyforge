package coraythan.keyswap.auctions

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/offers/secured")
class OfferEndpoints(
        val offerService: OfferService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/make-offer")
    fun makeOffer(@RequestBody makeOffer: MakeOffer) = offerService.makeOffer(makeOffer.auctionId, makeOffer.amount, makeOffer.message)

}
