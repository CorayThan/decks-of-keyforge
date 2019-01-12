package coraythan.keyswap.userdeck

data class ListingInfo(
        val deckId: Long,
        val forSale: Boolean,
        val forTrade: Boolean,
        val condition: DeckCondition,
        val askingPrice: Double?,
        val listingInfo: String,
        val externalLink: String,
        val expireInDays: Int
)
