package coraythan.keyswap.userdeck

import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generatets.TsOptional
import coraythan.keyswap.generic.Country
import java.time.LocalTime
import java.util.*

@GenerateTs
data class ListingInfo(
        val deckId: Long?,
        val acceptingOffers: Boolean,
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
        val tagId: Long? = null,
        val relistAtPrice: Int? = null,

        val editAuctionId: UUID? = null,
) {
    @TsOptional
    val endTimeLocalTime = if (this.endTime.isNullOrBlank()) null else LocalTime.parse(this.endTime)
    @TsOptional
    val auction = startingBid != null
}

@GenerateTs
data class UpdatePrice(
        val auctionId: UUID,
        val askingPrice: Int?
)
