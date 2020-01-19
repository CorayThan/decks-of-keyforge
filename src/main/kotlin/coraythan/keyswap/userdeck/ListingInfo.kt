package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.generic.Country
import java.time.LocalTime
import java.util.*

data class ListingInfo(
        val deckId: Long,
        val forSaleInCountry: Country,
        val language: DeckLanguage = DeckLanguage.ENGLISH,
        val condition: DeckCondition,
        val listingInfo: String? = "",
        val externalLink: String? = "",
        val expireInDays: Int?,

        val bidIncrement: Int? = null,

        val startingBid: Int? = null,
        val buyItNow: Int? = null,
        val endTime: String? = null,

        val editAuctionId: UUID? = null
) {
    val endTimeLocalTime = if (this.endTime.isNullOrBlank()) null else LocalTime.parse(this.endTime)
    val auction = startingBid != null
}

data class UpdatePrice(
        val auctionId: UUID,
        val askingPrice: Int?
)
