package coraythan.keyswap.sellerratings

import coraythan.keyswap.nowLocal
import java.time.LocalDateTime

data class SellerRating(
        // 0 to 5
        val rating: Int,
        val review: String,

        val created: LocalDateTime = nowLocal(),
        val updated: LocalDateTime?
)
