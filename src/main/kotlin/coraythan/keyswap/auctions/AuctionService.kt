package coraythan.keyswap.auctions

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.now
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.userdeck.UserDeckService
import coraythan.keyswap.users.CurrentUserService
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class AuctionService(
        private val auctionRepo: AuctionRepo,
        private val auctionBidRepo: AuctionBidRepo,
        private val currentUserService: CurrentUserService,
        private val userDeckService: UserDeckService,
        private val userDeckRepo: UserDeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun list(listingInfo: ListingInfo) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val auctionListingInfo = listingInfo.auctionListingInfo ?: throw BadRequestException("Auction listing info can't be null.")
        if (listingInfo.forSale || listingInfo.forTrade) {
            throw BadRequestException("Can't be for sale or trade if it is an auction.")
        }
        listingInfo.expireInDays ?: throw BadRequestException("Must include expires in days for auctions.")
        userDeckService.list(listingInfo, currentUser)

        val userDeck = userDeckRepo.findByDeckIdAndUserId(listingInfo.deckId, currentUser.id) ?: throw IllegalStateException("No user deck found for auction.")

        val endDateTime = now().plusDays(listingInfo.expireInDays.toLong())
        val endMinutesMod = endDateTime.minute % 15
        val endMinutes = endDateTime.minute - endMinutesMod
//        val endMinutesRounded = if (endMinutesMod < 8) -endMinutesMod else (15 - endMinutesMod)
        log.info("End minutes: ${endDateTime.minute} end minutes mod: ${endMinutesMod} end minutes mod rounded: ${endMinutes}")

        val auction = Auction(
                durationDays = listingInfo.expireInDays,
                endDateTime = endDateTime.withMinute(endMinutes),
                bidIncrement = auctionListingInfo.bidIncrement,
                startingBid = auctionListingInfo.startingBid,
                buyItNow = auctionListingInfo.buyItNow
        )
        userDeckRepo.save(userDeck.copy(auction = auction))
    }

    fun bid(auctionId: UUID, bid: Int): BidPlacementResult {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")
        val requiredBid = auction.nextBid
        val now = now()
        if (auction.complete) {
            return BidPlacementResult(false, false, "Sorry, your bid could not be placed because the auction has ended.")
        }
        if (bid < requiredBid) {
            return BidPlacementResult(false, false, "Your bid was too low. Please refresh the page and try again.")
        }
        if (user.username == auction.userDeck?.ownedBy) {
            throw UnauthorizedException("You can't bid on your own deck.")
        }
        val withBid = auction.copy(
                bids = auction.bids.plus(AuctionBid(
                        bidder = user,
                        bid = bid,
                        bidTime = now,
                        auction = auction
                )),
                endDateTime = if (now.plusMinutes(15) > auction.endDateTime) {
                    auction.endDateTime.plusMinutes(15)
                } else {
                    auction.endDateTime
                }
        )

        val saved = auctionRepo.save(withBid)
        val newHighBidder = saved.highestBidderUsername
        val highBid = saved.highestBid

        return BidPlacementResult(
                true,
                newHighBidder == user.username,
                "You are now the highest bidder with a bid of $highBid."
        )
    }

    fun buyNow() {

    }

    fun cancel(id: UUID) {

    }
}
