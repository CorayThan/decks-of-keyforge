package coraythan.keyswap.userdeck

import coraythan.keyswap.auctions.AuctionListingInfo
import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.generic.Country

data class ListingInfo(
        val deckId: Long,
        val forSale: Boolean,
        val forTrade: Boolean,
        val forSaleInCountry: Country,
        val language: DeckLanguage = DeckLanguage.ENGLISH,
        val condition: DeckCondition,
        val askingPrice: Double?,
        val listingInfo: String? = "",
        val externalLink: String? = "",
        val expireInDays: Int?,
        val auctionListingInfo: AuctionListingInfo? = null
)

data class UpdatePrice(
        val deckId: Long,
        val askingPrice: Double?
)
