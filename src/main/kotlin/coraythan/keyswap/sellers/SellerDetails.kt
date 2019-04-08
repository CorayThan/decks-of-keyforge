package coraythan.keyswap.sellers

import coraythan.keyswap.generic.Country
import java.time.LocalDate

data class SellerDetails(
        val storeName: String,
        val username: String,
        val decksAvailable: Int,
        val country: Country,
        val mostRecentListing: LocalDate,
        val storeDescription: String?,
        val discord: String?,
        val email: String?
)
