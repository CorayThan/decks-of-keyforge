package coraythan.keyswap.auctions

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.userdeck.ListingInfo

@GenerateTs
data class BulkListing(
    val listingInfo: ListingInfo,
    val decks: List<Long>,
    val addTag: String?,
)
