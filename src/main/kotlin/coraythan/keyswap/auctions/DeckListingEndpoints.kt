package coraythan.keyswap.auctions

import coraythan.keyswap.Api
import coraythan.keyswap.userdeck.ListingInfo
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/deck-listings")
class DeckListingEndpoints(
        val deckListingService: DeckListingService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/secured/list")
    fun list(@RequestBody listingInfo: ListingInfo, @RequestHeader(value = "Timezone") offsetMinutes: Int) = deckListingService.list(listingInfo, offsetMinutes)

    @PostMapping("/secured/bulk-list")
    fun bulkList(@RequestBody listings: BulkListing, @RequestHeader(value = "Timezone") offsetMinutes: Int) = deckListingService.bulkList(listings, offsetMinutes)

    @PostMapping("/secured/cancel/{deckId}")
    fun cancel(@PathVariable deckId: Long) = deckListingService.cancelListing(deckId)

    @PostMapping("/secured/cancel-and-remove/{deckId}")
    fun cancelAndRemove(@PathVariable deckId: Long) = deckListingService.cancelAndRemoveListing(deckId)

    @PostMapping("/secured/buy-it-now/{deckListingId}")
    fun buyItNow(@PathVariable deckListingId: UUID) = deckListingService.buyItNow(deckListingId)

    @GetMapping("/{deckListingId}")
    fun auctionInfo(@PathVariable deckListingId: UUID, @RequestHeader(value = "Timezone") offsetMinutes: Int) = deckListingService.deckListingInfo(deckListingId, offsetMinutes)

    @GetMapping("/secured/listings-for-user")
    fun activeListingsForUser() = deckListingService.findActiveListingsForUser()

    @PostMapping("/secured/remove-all")
    fun removeAllDecks(@RequestBody password: PasswordHolder) = deckListingService.removeAllDecks(password.password)
}

data class PasswordHolder(val password: String)
