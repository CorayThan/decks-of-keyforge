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
    fun makeOffer(@RequestBody makeOffer: MakeOffer)
            = offerService.makeOffer(makeOffer.deckListingId, makeOffer.amount, makeOffer.message, makeOffer.expireInDays)

    @PostMapping("/cancel/{id}")
    fun cancel(@PathVariable id: UUID) = offerService.cancelOffer(id)

    @GetMapping("/has-offers-to-view")
    fun hasOffersToView() = offerService.hasOffersToView()

    @PostMapping("/my-offers")
    fun myOffers(@RequestBody statuses: Set<OfferStatus>, @RequestHeader(value = "Timezone") offsetMinutes: Int)
            = offerService.findMyOffers(offsetMinutes, statuses)

    @PostMapping("/for-deck/{deckListingId}")
    fun offersForDeckListing(@PathVariable deckListingId: UUID, @RequestHeader(value = "Timezone") offsetMinutes: Int)
            = offerService.offersForDeckListing(offsetMinutes, deckListingId)

}
