package coraythan.keyswap.auctions

data class BidPlacementResult(
        val successful: Boolean,
        val youAreHighBidder: Boolean,
        val message: String
)
