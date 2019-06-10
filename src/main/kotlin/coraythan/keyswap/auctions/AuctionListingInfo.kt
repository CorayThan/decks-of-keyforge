package coraythan.keyswap.auctions

import java.time.LocalTime

data class AuctionListingInfo(
        val bidIncrement: Int = 5,

        val startingBid: Int = 0,

        val buyItNow: Int? = null,

        val endTime: String
) {
    val endTimeLocalTime = LocalTime.parse(this.endTime)
}
