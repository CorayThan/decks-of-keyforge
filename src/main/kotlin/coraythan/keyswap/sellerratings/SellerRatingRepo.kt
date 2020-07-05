package coraythan.keyswap.sellerratings

import org.springframework.data.repository.CrudRepository
import java.util.*

interface SellerRatingRepo : CrudRepository<SellerRating, Long> {
    fun findBySellerId(sellerId: UUID): List<SellerRating>
    fun findAllProjectedBy(): List<SellerRatingScores>
    fun deleteByReviewerIdAndSellerId(reviewerId: UUID, sellerId: UUID)
}

interface SellerRatingScores {
    val rating: Int
    val sellerId: UUID
}