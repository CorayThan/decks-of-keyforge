package coraythan.keyswap.auctions

import coraythan.keyswap.*
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.salenotifications.ForSaleNotificationsService
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.util.*

private const val fourteenMin = "PT14M"

@Service
@Transactional
class AuctionService(
        private val auctionRepo: AuctionRepo,
        private val currentUserService: CurrentUserService,
        private val deckRepo: DeckRepo,
        private val emailService: EmailService,
        private val forSaleNotificationsService: ForSaleNotificationsService,
        private val userRepo: KeyUserRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = "PT6H", initialDelayString = SchedulingConfig.unexpiredDecksInitialDelay)
    fun unlistExpiredDecks() {
        log.info("$scheduledStart unlisting expired auction decks.")

        val buyItNowsToComplete = auctionRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(AuctionStatus.BUY_IT_NOW_ONLY, now())

        buyItNowsToComplete.forEach {
            updateDeckListingStatus(it)
            auctionRepo.delete(it)
        }

        log.info("$scheduledStop unlisting expired auction decks.")
    }

    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "completeAuctions", lockAtMostForString = fourteenMin, lockAtLeastForString = fourteenMin)
    fun completeAuctions() {
        log.info("$scheduledStart complete auctions.")

        val auctionsToComplete = auctionRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(AuctionStatus.ACTIVE, now())

        auctionsToComplete.forEach {
            val buyer = it.highestBidder()
            log.info("Auction to complete: ${it.endDateTime}")
            endAuction(buyer != null, it)
        }

        log.info("$scheduledStop complete auctions.")
    }

    fun list(listingInfo: ListingInfo, offsetMinutes: Int) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        if (listingInfo.startingBid == null && listingInfo.buyItNow == null) {
            throw BadRequestException("Listing must include starting bid or buy it now.")
        }
        val status = if (!listingInfo.auction) {
            AuctionStatus.BUY_IT_NOW_ONLY
        } else {
            if (listingInfo.bidIncrement == null || listingInfo.bidIncrement < 1) throw BadRequestException("Bid increment must not be null or less than 1.")
            AuctionStatus.ACTIVE
        }
        listingInfo.expireInDays ?: throw BadRequestException("Must include expires in days for auctions.")

        val deck = deckRepo.findByIdOrNull(listingInfo.deckId) ?: throw IllegalStateException("No deck with id ${listingInfo.deckId}")

        if (deck.forAuction) throw BadRequestException("This deck is already listed as an auction.")

        val listingDate = now()
        val endTime = listingInfo.endTimeLocalTime.withOffsetMinutes(offsetMinutes)
        val endDateTime = listingDate.plusDays(listingInfo.expireInDays.toLong())
                .withHour(endTime.hour)
                .withMinute(endTime.minute)
        val endMinutesMod = endDateTime.minute % 15
        val endMinutes = endDateTime.minute - endMinutesMod
        val realEnd = endDateTime.withMinute(endMinutes)
//        log.info("End minutes: ${endDateTime.minute} end minutes mod: ${endMinutesMod} end minutes mod rounded: ${endMinutes}")

        val auction = Auction(
                durationDays = listingInfo.expireInDays,
                endDateTime = realEnd,
                bidIncrement = listingInfo.bidIncrement,
                startingBid = listingInfo.startingBid,
                buyItNow = listingInfo.buyItNow,
                deck = deck,
                seller = currentUser,
                language = listingInfo.language,
                condition = listingInfo.condition,
                externalLink = listingInfo.externalLink,
                listingInfo = listingInfo.listingInfo,
                forSaleInCountry = currentUser.country ?: throw BadRequestException("You must have selected a country to list decks for sale."),
                currencySymbol = currentUser.currencySymbol,
                status = status
        )
        auctionRepo.save(auction)
        if (listingInfo.auction) {
            // for auction
            deckRepo.save(deck.copy(forAuction = true, auctionEnd = realEnd, listedOn = listingDate, forSale = listingInfo.buyItNow != null))
        } else {
            deckRepo.save(deck.copy(forSale = true, forTrade = currentUser.allowsTrades))
        }
        userRepo.save(currentUser.copy(mostRecentDeckListing = listingDate))
        forSaleNotificationsService.sendNotifications(listingInfo)
    }

    fun bid(auctionId: UUID, bid: Int): BidPlacementResult {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")
        val requiredBid = auction.nextBid ?: throw BadRequestException("Cannot bid on a sale that is not an auction, id $auctionId")
        val now = now()
        if (auction.status != AuctionStatus.ACTIVE || now.isAfter(auction.endDateTime)) {
            return BidPlacementResult(false, false, "Sorry, your bid could not be placed because the auction has ended.")
        }
        if (user.id == auction.seller.id) {
            throw UnauthorizedException("You can't bid on your own deck.")
        }
        if (bid < requiredBid) {
            return BidPlacementResult(false, false, "Your bid was too low. Please refresh the page and try again.")
        }
        if (auction.highestBidderUsername == user.username && bid <= auction.realMaxBid() ?: -1) {
            return BidPlacementResult(
                    false,
                    true,
                    "Your new bid must be greater than your previous bid."
            )
        }
        if (auction.buyItNow != null && bid >= auction.buyItNow) {
            return BidPlacementResult(
                    false,
                    false,
                    "Use buy it now instead of bidding higher than the buy it now."
            )
        }
        val previousHighBidder = auction.highestBidder()
        val updateEndDateTime = now.plusMinutes(15) > auction.endDateTime
        val newAuctionEnd = auction.endDateTime.plusMinutes(15)
        val withBid = auction.copy(
                bids = auction.bids.plus(AuctionBid(
                        bidder = user,
                        bid = bid,
                        bidTime = now,
                        auction = auction
                )),
                endDateTime = if (updateEndDateTime) newAuctionEnd else auction.endDateTime
        )

        val saved = auctionRepo.save(withBid)
        if (updateEndDateTime) deckRepo.save(auction.deck.copy(auctionEnd = newAuctionEnd))
        val newHighBidder = saved.highestBidderUsername
        val highBid = saved.highestBid

        return BidPlacementResult(
                true,
                newHighBidder == user.username,
                if (newHighBidder == user.username) {
                    if (previousHighBidder != null) {
                        val timeLeft = Duration.between(now(), if (updateEndDateTime) newAuctionEnd else auction.endDateTime)
                        GlobalScope.launch {
                            emailService.sendOutBidEmail(previousHighBidder, auction.deck, timeLeft.toReadableString())
                        }
                    }
                    "You are now the highest bidder with a current bid of $highBid, and a max bid of $bid."
                } else {
                    "Your bid was placed, but you are not the highest bidder."
                }
        )
    }

    fun buyItNow(auctionId: UUID): BidPlacementResult {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")
        val now = now()
        if (now.isAfter(auction.endDateTime)) {
            return BidPlacementResult(false, false, "Sorry, you couldn't buy it now because the sale has ended.")
        }
        if (user.id == auction.seller.id) {
            throw UnauthorizedException("You can't buy your own deck.")
        }
        if (auction.buyItNow == null) throw BadRequestException("Can't buy it now when the auction doesn't have buy it now.")

        endAuction(true, auction, user)
        val previousHighBidder = auction.highestBidder()
        if (previousHighBidder != null && previousHighBidder != user) {
            emailService.sendSomeoneElseBoughtNowEmail(previousHighBidder, auction.deck)
        }

        return BidPlacementResult(
                true,
                true,
                "You have purchased the deck with your buy it now."
        )
    }

    fun auctionInfo(auctionId: UUID, offsetMinutes: Int): AuctionDto {
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction with id $auctionId")
        val fakeUsernames = auction.bids.sortedBy { it.bidTime }.map { it.bidder.username }
        val dto = auction.toDto(offsetMinutes)
        if (auction.endDateTime.plusDays(14) < now()) {
            // auction is two weeks old, show real usernames
            return dto
        }
        val currentUser = currentUserService.loggedInUser()
        return dto.copy(bids = dto.bids.map {
            it.copy(
                    bidderUsername = if (currentUser?.username == it.bidderUsername) {
                        it.bidderUsername
                    } else {
                        "User ${fakeUsernames.indexOf(it.bidderUsername) + 1}"
                    }
            )
        })
    }

    private fun endAuction(sold: Boolean, auction: Auction, buyItNowUser: KeyUser? = null) {

        val end = now()
        auctionRepo.save(auction.copy(
                status = AuctionStatus.COMPLETE,
                boughtWithBuyItNow = buyItNowUser,
                boughtNowOn = if (buyItNowUser == null) null else end
        ))

        updateDeckListingStatus(auction, sold)

        GlobalScope.launch {
            try {
                if (sold) {
                    emailService.sendAuctionPurchaseEmail(
                            buyItNowUser ?: auction.highestBidder()!!,
                            auction.seller,
                            auction.deck,
                            if (buyItNowUser != null) auction.buyItNow!! else auction.highestBid!!,
                            auction.seller.currencySymbol
                    )
                } else {
                    emailService.sendAuctionDidNotSellEmail(auction.seller, auction.deck)
                }
            } catch (e: Exception) {
                log.warn("Couldn't send for sale notification for ${auction.id}", e)
            }
        }
    }

    fun cancelAuction(deckId: Long): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auctions = auctionRepo.findBySellerIdAndDeckIdAndStatus(user.id, deckId, AuctionStatus.ACTIVE)
        if (auctions.size > 1) {
            throw IllegalStateException("Seller shouldn't have more than one active auction for a single deck ${user.username} deckId: ${deckId}")
        }
        if (auctions.isEmpty()) return true
        val auction = auctions[0]
        if (auction.bids.isNotEmpty()) return false
        updateDeckListingStatus(auction)
        auctionRepo.delete(auction)
        return true
    }

    private fun updateDeckListingStatus(auction: Auction, sold: Boolean = false) {
        val auctionsForDeck = auction.deck.auctions
        val otherListingsForDeck = auctionsForDeck
                .filter { (it.status == AuctionStatus.ACTIVE || it.status == AuctionStatus.BUY_IT_NOW_ONLY) && it.id != auction.id }

        // This might be someone else unlisting the deck for sale while a different person has an active auction for it
        val stillForAuction = otherListingsForDeck.any { it.status == AuctionStatus.ACTIVE }
        deckRepo.save(auction.deck.copy(
                forAuction = stillForAuction,
                auctionEnd = if (stillForAuction) auction.deck.auctionEnd else null,
                listedOn = if (stillForAuction) auction.deck.listedOn else null,
                forSale = otherListingsForDeck.isEmpty(),
                forTrade = false,
                completedAuction = sold || auction.deck.completedAuction
        ))
    }

}
