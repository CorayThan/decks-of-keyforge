package coraythan.keyswap.decks.models

import coraythan.keyswap.generic.Country
import coraythan.keyswap.userdeck.DeckCondition
import java.time.LocalDate

data class DeckSaleInfo(
        val forSale: Boolean,
        val forTrade: Boolean,
        val forSaleInCountry: Country?,

        val askingPrice: Double?,

        val listingInfo: String?,
        val externalLink: String?,

        val condition: DeckCondition,

        val dateListed: LocalDate,
        val expiresAt: LocalDate?,

        val username: String,
        val publicContactInfo: String?
)