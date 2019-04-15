package coraythan.keyswap.auctions

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.now
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.userdeck.UserDeckService
import coraythan.keyswap.users.CurrentUserService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AuctionService(
        private val auctionRepo: AuctionRepo,
        private val auctionBidRepo: AuctionBidRepo,
        private val currentUserService: CurrentUserService,
        private val userDeckService: UserDeckService,
        private val userDeckRepo: UserDeckRepo
) {

    fun listAuction(listingInfo: ListingInfo) {
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
        val endMinutesRounded = if (endMinutesMod < 8) -endMinutesMod else (15 - endMinutesMod)

        val auction = Auction(
                durationDays = listingInfo.expireInDays,
                endDateTime = endDateTime.withMinute(endMinutesRounded),
                bidIncrement = auctionListingInfo.bidIncrement,
                startingBid = auctionListingInfo.startingBid,
                buyItNow = auctionListingInfo.buyItNow,
                userDeck = userDeck
        )
        auctionRepo.save(auction)
    }

    fun bidOnAuction() {

    }

    fun buyAuctionNow() {

    }

    fun cancelAuction() {

    }
}