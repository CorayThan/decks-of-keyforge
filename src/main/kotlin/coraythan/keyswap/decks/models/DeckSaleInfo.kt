package coraythan.keyswap.decks.models

import coraythan.keyswap.generic.Country
import coraythan.keyswap.userdeck.DeckCondition
import java.time.LocalDate
import java.util.*

data class DeckSaleInfo(
        val forSale: Boolean,
        val forTrade: Boolean,
        val auction: Boolean,

        val forSaleInCountry: Country?,
        val currencySymbol: String? = "$",
        val language: DeckLanguage? = null,

        val askingPrice: Double?,

        val highestBid: Int?,
        val startingBid: Int?,
        val buyItNow: Int?,
        val auctionEndDateTime: String?,
        val auctionId: UUID?,
        val nextBid: Int?,
        val youAreHighestBidder: Boolean?,
        val yourMaxBid: Int?,

        val listingInfo: String?,
        val externalLink: String?,

        val condition: DeckCondition,

        val dateListed: LocalDate,
        val expiresAt: LocalDate?,

        val username: String,
        val publicContactInfo: String?,
        val discord: String?
)
