package coraythan.keyswap.auctions.offers

import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingService
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.auctions.OfferPlacementResult
import coraythan.keyswap.auctions.purchases.PurchaseService
import coraythan.keyswap.auctions.purchases.SaleType
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Transactional
@Service
class OfferService(
        private val offerRepo: OfferRepo,
        private val deckListingService: DeckListingService,
        private val deckListingRepo: DeckListingRepo,
        private val currentUserService: CurrentUserService,
        private val emailService: EmailService,
        private val purchaseService: PurchaseService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = "PT1H", initialDelayString = SchedulingConfig.expireOffers)
    fun expireOffers() {
        val toExpire = offerRepo.findByExpiresTimeBeforeAndStatusNot(nowLocal(), OfferStatus.EXPIRED)
        toExpire.forEach { offerRepo.save(it.copy(status = OfferStatus.EXPIRED)) }
    }

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
        val offer = Offer(amount, auction, auction.seller, user, message, user.country, expiresTime = nowLocal().plusDays(expiresInDays.toLong()))
        offerRepo.save(offer)
        emailService.sendOfferReceivedEmail(auction.deck, amount, auction.seller)
        return OfferPlacementResult(true, "Your offer has been placed.")
    }

    fun archiveOffer(offerId: UUID, archive: Boolean = true): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val offer = offerRepo.findByIdOrNull(offerId) ?: throw BadRequestException("Couldn't archive, no offer for id $offerId")

        if (archive && offer.status == OfferStatus.SENT) {
            return false
        }

        when {
            offer.sender.id == user.id -> offerRepo.save(offer.copy(senderArchived = archive))
            offer.recipient.id == user.id -> offerRepo.save(offer.copy(recipientArchived = archive))
            else -> throw UnauthorizedException("Can't archive someone else's offer.")
        }

        return true
    }

    fun cancelOffer(offerId: UUID): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val offer = offerRepo.findByIdOrNull(offerId) ?: throw BadRequestException("Couldn't cancel, no offer for id $offerId")
        if (offer.sender.id != user.id) throw UnauthorizedException("You can't cancel someone else's offer.")
        if (offer.status != OfferStatus.SENT) {
            return false
        }

        offerRepo.save(offer.copy(status = OfferStatus.CANCELED))

        return true
    }

    fun acceptOffer(offerId: UUID): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val offer = offerRepo.findByIdOrNull(offerId) ?: throw BadRequestException("Couldn't accept, no offer for id $offerId")
        if (offer.recipient.id != user.id) throw UnauthorizedException("You can't accept someone else's offer.")
        if (offer.status != OfferStatus.SENT) {
            return false
        }

        offerRepo.save(offer.copy(status = OfferStatus.ACCEPTED))

        deckListingService.offerAccepted(offer.auction.deck.id)

        purchaseService.savePurchase(
                saleType = SaleType.OFFER,
                saleAmount = offer.amount,
                deck = offer.auction.deck,
                buyer = offer.sender,
                seller = offer.recipient
        )

        emailService.sendOfferAcceptedEmail(offer.auction.deck, offer.sender, offer.recipient, offer.amount)

        offer.auction.offers
                .filter { it.id != offer.id }
                .forEach {
                    rejectOfferWithOfferAndUser(it, user, true)
                }

        return true
    }

    fun rejectOffer(offerId: UUID): Boolean {
        val offer = offerRepo.findByIdOrNull(offerId) ?: throw BadRequestException("No offer for id $offerId")
        val user = currentUserService.loggedInUserOrUnauthorized()
        return rejectOfferWithOfferAndUser(offer, user)
    }

    private fun rejectOfferWithOfferAndUser(offer: Offer, user: KeyUser, acceptedDifferent: Boolean = false): Boolean {
        if (offer.recipient.id != user.id) throw UnauthorizedException("You can't reject someone else's offer.")
        if (offer.status != OfferStatus.SENT) {
            return false
        }

        offerRepo.save(offer.copy(status = OfferStatus.REJECTED))

        try {
            emailService.sendOfferRejectedEmail(offer.auction.deck, offer.sender, acceptedDifferent, offer.recipient, offer.amount)
        } catch (e: Exception) {
            log.warn("Couldn't send offer rejected email to ${offer.sender.primaryEmail}")
        }

        return true
    }

    fun hasOffersToView() =
            offerRepo.existsByRecipientIdAndViewedTimeIsNull(currentUserService.loggedInUserOrUnauthorized().id)

    fun findOffer(offsetMinutes: Int, id: UUID): OfferDto {
        return offerRepo.findByIdOrNull(id)?.toDto(offsetMinutes) ?: throw BadRequestException("No offer for id $id")
    }

    fun findMyOffers(offsetMinutes: Int, includeArchived: Boolean): MyOffers {
        val user = currentUserService.loggedInUserOrUnauthorized()
        return MyOffers(
                offersToMe = (if (includeArchived) offerRepo.findByRecipientId(user.id) else offerRepo.findByRecipientIdAndRecipientArchivedFalse(user.id))
                        .sortedDescending().groupBy { it.auction.id }.values
                        .map { it.toOffersForDeck(offsetMinutes) },
                offersIMade = (if (includeArchived) offerRepo.findBySenderId(user.id) else offerRepo.findBySenderIdAndSenderArchivedFalse(user.id))
                        .sortedDescending().groupBy { it.auction.id }.values
                        .map { it.toOffersForDeck(offsetMinutes) }
        )
    }

    fun offersForDeckListing(offsetMinutes: Int, deckListingId: UUID): List<OfferDto> {
        return offerRepo.findByAuctionId(deckListingId).sorted().map { it.copy(message = "").toDto(offsetMinutes) }
    }
}
