package coraythan.keyswap.auctions.offers

import coraythan.keyswap.auctions.AuctionRepo
import coraythan.keyswap.auctions.AuctionStatus
import coraythan.keyswap.auctions.OfferPlacementResult
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
        if (user.country == null) {
            return OfferPlacementResult(false, "Please select a country on your profile before making an offer.")
        }
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")

        if (auction.status == AuctionStatus.COMPLETE) {
            return OfferPlacementResult(false, "This deck is not for sale, so you cannot make an offer.")
        }
        if (auction.status == AuctionStatus.ACTIVE) throw BadRequestException("Can't make an offer on an auction.")
        if (user.id == auction.seller.id) {
            throw UnauthorizedException("You can't buy your own deck.")
        }
        val offer = Offer(amount, auction, auction.seller, user, message, user.country)
        offerRepo.save(offer)
        return OfferPlacementResult(true, "Your offer has been placed.")
    }

    fun cancelOffer(offerId: UUID): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val offer = offerRepo.findByIdOrNull(offerId) ?: throw BadRequestException("No offer for id $offerId")
        if (offer.sender.id != user.id) throw UnauthorizedException("You can't cancel someone else's offer.")
        if (offer.status == OfferStatus.ACCEPTED) {
            return false
        }

        offerRepo.save(offer.copy(status = OfferStatus.CANCELED))

        return true
    }

    fun hasOffersToView() =
            offerRepo.existsByRecipientIdAndViewedTimeIsNull(currentUserService.loggedInUserOrUnauthorized().id)

    fun findMyOffers(offsetMinutes: Int, statuses: Set<OfferStatus>): MyOffers {
        val user = currentUserService.loggedInUserOrUnauthorized()
        return MyOffers(
                offersToMe = offerRepo.findByRecipientIdAndStatusIn(user.id, statuses).map { it.toDto(offsetMinutes) },
                offersIMade = offerRepo.findBySenderIdAndStatusIn(user.id, statuses).map { it.toDto(offsetMinutes) }
        )
    }
}
