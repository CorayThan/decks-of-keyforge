package coraythan.keyswap.auctions.offers

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/offers")
class OfferEndpoints(
        val offerService: OfferService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/secured/make-offer")
    fun makeOffer(@RequestBody makeOffer: MakeOffer)
            = offerService.makeOffer(makeOffer.deckListingId, makeOffer.amount, makeOffer.message, makeOffer.expireInDays)

    @PostMapping("/secured/cancel/{id}")
    fun cancel(@PathVariable id: UUID) = offerService.cancelOffer(id)

    @PostMapping("/secured/accept/{id}")
    fun accept(@PathVariable id: UUID) = offerService.acceptOffer(id)

    @PostMapping("/secured/reject/{id}")
    fun reject(@PathVariable id: UUID) = offerService.rejectOffer(id)

    @PostMapping("/secured/archive/{id}/{archive}")
    fun archive(@PathVariable id: UUID, @PathVariable archive: Boolean) = offerService.archiveOffer(id, archive)

    @GetMapping("/secured/has-offers-to-view")
    fun hasOffersToView() = offerService.hasOffersToView()

    @GetMapping("/secured/{id}")
    fun findOffer(@RequestHeader(value = "Timezone") offsetMinutes: Int, @PathVariable id: UUID) = offerService.findOffer(offsetMinutes, id)

    @GetMapping("/secured/my-offers")
    fun myOffers(@RequestHeader(value = "Timezone") offsetMinutes: Int, @RequestParam("include-archived") includeArchived: Boolean)
            = offerService.findMyOffers(offsetMinutes, includeArchived)

    @PostMapping("/for-deck/{deckListingId}")
    fun offersForDeckListing(@PathVariable deckListingId: UUID, @RequestHeader(value = "Timezone") offsetMinutes: Int)
            = offerService.offersForDeckListing(offsetMinutes, deckListingId)
}
