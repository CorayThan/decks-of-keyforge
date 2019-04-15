package coraythan.keyswap.auctions

data class AuctionListingInfo(
        val bidIncrement: Int = 5,

        val startingBid: Int = 0,

        val buyItNow: Int? = null
)
