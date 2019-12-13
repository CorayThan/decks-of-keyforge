package coraythan.keyswap.auctions

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.users.CurrentUserService
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
@Service
class OfferService(
        private val offerRepo: OfferRepo,
        private val auctionRepo: AuctionRepo,
        private val currentUserService: CurrentUserService
) {

    fun makeOffer(auctionId: UUID, amount: Int, message: String): OfferPlacementResult {
        if (amount < 1) throw BadRequestException("Offers must be positive.")
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")

        if (auction.status == AuctionStatus.COMPLETE) {
            return OfferPlacementResult(false, "This deck is not for sale, so you cannot make an offer.")
        }
        if (auction.status == AuctionStatus.ACTIVE) throw BadRequestException("Can't make an offer on an auction.")
        if (user.id == auction.seller.id) {
            throw UnauthorizedException("You can't buy your own deck.")
        }
        val offer = Offer(amount, auction, message)
        offerRepo.save(offer)
        return OfferPlacementResult(true, "Your offer has been placed.")
    }
}
