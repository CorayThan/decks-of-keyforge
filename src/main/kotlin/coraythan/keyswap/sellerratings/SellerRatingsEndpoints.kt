package coraythan.keyswap.sellerratings

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/seller-ratings")
class SellerRatingsEndpoints(
        private val sellerRatingsService: SellerRatingsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun findRatings() = sellerRatingsService.allRatings

    @GetMapping("/{sellerId}")
    fun findRatingsForSeller(@PathVariable sellerId: UUID) = sellerRatingsService.findSellerRatingInfo(sellerId)

    @PostMapping("/secured")
    fun createReview(@RequestBody review: CreateRating) = sellerRatingsService.createRating(review)

    @DeleteMapping("/secured/{sellerId}")
    fun deleteReview(@PathVariable sellerId: UUID) = sellerRatingsService.deleteRating(sellerId)
}
