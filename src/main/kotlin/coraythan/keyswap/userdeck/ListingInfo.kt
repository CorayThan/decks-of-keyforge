package coraythan.keyswap.userdeck

import coraythan.keyswap.generic.Country

data class ListingInfo(
        val deckId: Long,
        val forSale: Boolean,
        val forTrade: Boolean,
        val forSaleInCountry: Country?,
        val condition: DeckCondition,
        val askingPrice: Double?,
        val listingInfo: String,
        val externalLink: String,
        val expireInDays: Int?
)
