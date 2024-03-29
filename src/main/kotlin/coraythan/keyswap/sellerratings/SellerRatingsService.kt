package coraythan.keyswap.sellerratings

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.roundToOneSigDig
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.*

@Transactional
@Service
class SellerRatingsService(
    private val repo: SellerRatingRepo,
    private val deckRepo: DeckRepo,
    private val currentUserService: CurrentUserService,
    private val keyUserRepo: KeyUserRepo
) {

    var allRatings = listOf<SellerRatingSummary>()

    @Scheduled(fixedDelayString = "PT5M")
    fun refreshRatings() {
        allRatings = repo.findAllProjectedBy()
            .groupBy { it.sellerId }
            .map {
                SellerRatingSummary(
                    it.key,
                    it.value.map { rating -> rating.rating }.average().roundToOneSigDig(),
                    it.value.size
                )
            }
    }

    fun findSellerRatingInfo(sellerId: UUID): List<SellerRatingDetails> {
        return repo.findBySellerId(sellerId)
            .sortedByDescending { it.created }
            .map {
                val deck = if (it.deckPurchasedId != null) (deckRepo.findByIdOrNull(it.deckPurchasedId)
                    ?: throw IllegalStateException("No deck for id ${it.deckPurchasedId}")) else null
                SellerRatingDetails(
                    it.reviewer.username,
                    deck?.keyforgeId,
                    deck?.name,
                    it.review,
                    it.title,
                    it.rating,
                    it.created.toLocalDate()
                )
            }
    }

    fun createRating(save: CreateRating) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        if (save.sellerId == currentUser.id) throw BadRequestException("Can't review yourself.")
        if (save.rating < 1 || save.rating > 5) throw BadRequestException("Rating must be between 1 and 5.")
        if (save.review.trim().isEmpty()) throw BadRequestException("Rating must include a review.")
        repo.save(
            SellerRating(
                save.rating,
                save.title.trim(),
                save.review.trim(),
                save.sellerId,
                currentUser,
                save.deckPurchasedId
            )
        )
        this.updateCachedAndUser(save.sellerId)
    }

    fun deleteRating(sellerId: UUID) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        repo.deleteByReviewerIdAndSellerId(currentUser.id, sellerId)
        this.updateCachedAndUser(sellerId)
    }

    private fun updateCachedAndUser(sellerId: UUID) {
        this.refreshRatings()
        val ratingUpdatedTo = allRatings.find { it.sellerId == sellerId }
        keyUserRepo.updateRating(sellerId, ratingUpdatedTo?.rating ?: 0.0)
    }
}

@GenerateTs
data class SellerRatingSummary(
    val sellerId: UUID,
    val rating: Double,
    val reviews: Int
)

@GenerateTs
data class SellerRatingDetails(
    val reviewerUsername: String,
    val deckKeyForgeId: String?,
    val deckName: String?,
    val review: String,
    val title: String,
    val rating: Int,
    val created: LocalDate
)

@GenerateTs
data class CreateRating(
    val rating: Int,
    val title: String,
    val review: String,
    val sellerId: UUID,
    val deckPurchasedId: Long?
)
