package coraythan.keyswap.auctions.offers

import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
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
        private val deckListingRepo: DeckListingRepo,
        private val currentUserService: CurrentUserService
) {

    fun makeOffer(auctionId: UUID, amount: Int, message: String, expiresInDays: Int): OfferPlacementResult {
        if (amount < 1) throw BadRequestException("Offers must be positive.")
        if (expiresInDays < 1) throw BadRequestException("Expires in days must be positive.")
        val user = currentUserService.loggedInUserOrUnauthorized()
        if (user.country == null) {
            return OfferPlacementResult(false, "Please select a country on your profile before making an offer.")
        }
        val auction = deckListingRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")

        if (auction.status == DeckListingStatus.COMPLETE) {
            return OfferPlacementResult(false, "This deck is not for sale, so you cannot make an offer.")
        }
        if (auction.status == DeckListingStatus.AUCTION) throw BadRequestException("Can't make an offer on an auction.")
        if (user.id == auction.seller.id) {
            throw UnauthorizedException("You can't buy your own deck.")
        }
        val offer = Offer(amount, auction, auction.seller, user, message, user.country, expiresInDays = expiresInDays)
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

    fun findMyOffers(offsetMinutes: Int): MyOffers {
        val user = currentUserService.loggedInUserOrUnauthorized()
        return MyOffers(
                offersToMe = offerRepo.findByRecipientId(user.id).sortedDescending().groupBy { it.auction.id }.values.map { it.toOffersForDeck(offsetMinutes) },
                offersIMade = offerRepo.findBySenderId(user.id).sortedDescending().groupBy { it.auction.id }.values.map { it.toOffersForDeck(offsetMinutes) }
        )
    }

    fun offersForDeckListing(offsetMinutes: Int, deckListingId: UUID): List<OfferDto> {
        return offerRepo.findByAuctionId(deckListingId).sorted().map { it.copy(message = "").toDto(offsetMinutes) }
    }
}
