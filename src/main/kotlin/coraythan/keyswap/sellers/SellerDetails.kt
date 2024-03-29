package coraythan.keyswap.sellers

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import java.time.LocalDate
import java.util.*

@GenerateTs
data class SellerDetails(
        val sellerId: UUID,
        val storeName: String,
        val username: String,
        val decksAvailable: Int,
        val country: Country,
        val mostRecentListing: LocalDate,
        val storeDescription: String?,
        val discord: String?,
        val email: String?,
        val storeIconKey: String?,
        val storeBannerKey: String?
)
