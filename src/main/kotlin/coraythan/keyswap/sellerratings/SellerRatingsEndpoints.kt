package coraythan.keyswap.sellerratings

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.http.CacheControl
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("${Api.base}/seller-ratings")
class SellerRatingsEndpoints(
    private val sellerRatingsService: SellerRatingsService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @GetMapping
    fun findRatings(): ResponseEntity<List<SellerRatingSummary>> {
        val ratings = sellerRatingsService.allRatings

        return ResponseEntity.ok().cacheControl(
            CacheControl
                .maxAge(10, TimeUnit.MINUTES)
        ).body(ratings)
    }

    @GetMapping("/{sellerId}")
    fun findRatingsForSeller(@PathVariable sellerId: UUID) = sellerRatingsService.findSellerRatingInfo(sellerId)

    @PostMapping("/secured")
    fun createReview(@RequestBody review: CreateRating) = sellerRatingsService.createRating(review)

    @DeleteMapping("/secured/{sellerId}")
    fun deleteReview(@PathVariable sellerId: UUID) = sellerRatingsService.deleteRating(sellerId)
}
