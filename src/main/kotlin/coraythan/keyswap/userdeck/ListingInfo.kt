package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.generic.Country
import java.time.LocalTime

data class ListingInfo(
        val deckId: Long,
        val forSaleInCountry: Country,
        val language: DeckLanguage = DeckLanguage.ENGLISH,
        val condition: DeckCondition,
        val askingPrice: Double?,
        val listingInfo: String? = "",
        val externalLink: String? = "",
        val expireInDays: Int?,

        val bidIncrement: Int? = null,

        // Must include starting bid and/or buy it now
        val startingBid: Int? = null,
        val buyItNow: Int? = null,
        val endTime: String? = null
) {
    val endTimeLocalTime = LocalTime.parse(this.endTime)
    val auction = startingBid != null
}

data class UpdatePrice(
        val deckId: Long,
        val askingPrice: Int?
)
