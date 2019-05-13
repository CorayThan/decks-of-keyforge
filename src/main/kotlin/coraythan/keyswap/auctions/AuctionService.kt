package coraythan.keyswap.auctions

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.now
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
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
import java.util.*

private const val fourteenMin = "PT14M"

@Service
@Transactional
class AuctionService(
        private val auctionRepo: AuctionRepo,
        private val currentUserService: CurrentUserService,
        private val deckRepo: DeckRepo,
        private val emailService: EmailService,
        private val userRepo: KeyUserRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "completeAuctions", lockAtMostForString = fourteenMin, lockAtLeastForString = fourteenMin)
    fun completeAuctions() {
        log.info("$scheduledStart complete auctions.")

        val auctionsToComplete = auctionRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(AuctionStatus.ACTIVE, now())
//        val allAuctions = auctionRepo.findAll()
//                .toList()
//        val auctionsToCompleteFromCode = allAuctions
//                .filter { it.status == AuctionStatus.ACTIVE && it.endDateTime < now().plusDays(1) }

//        log.info("Decks in complete: ${auctionsToComplete.map { "${it.deck.name} ${it.status} ${it.endDateTime} ${now().plusDays(1)}" }}")
//        log.info("Decks in complete from code: ${auctionsToCompleteFromCode.map { "${it.deck.name} ${it.status} ${it.endDateTime} ${now().plusDays(1)}" }}")
//        log.info("All auctions: ${allAuctions.map { "${it.deck.name} ${it.status} ${it.endDateTime} ${now().plusDays(1)}" }}")

        auctionsToComplete.forEach {
            val buyer = it.highestBidder()
            log.info("Auction to complete: ${it.endDateTime}")
            endAuction(buyer != null, it)
        }

        log.info("$scheduledStop complete auctions.")
    }

    fun list(listingInfo: ListingInfo) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val auctionListingInfo = listingInfo.auctionListingInfo ?: throw BadRequestException("Auction listing info can't be null.")
        if (listingInfo.forSale || listingInfo.forTrade) {
            throw BadRequestException("Can't be for sale or trade if it is an auction.")
        }
        if (auctionListingInfo.bidIncrement < 1) throw BadRequestException("Bid increment must be 1 or more.")
        listingInfo.expireInDays ?: throw BadRequestException("Must include expires in days for auctions.")

        val deck = deckRepo.findByIdOrNull(listingInfo.deckId) ?: throw IllegalStateException("No deck with id ${listingInfo.deckId}")

        if (deck.forAuction) throw BadRequestException("This deck is already listed as an auction.")

        val listingDate = now()
        val endDateTime = listingDate.plusDays(listingInfo.expireInDays.toLong())
        val endMinutesMod = endDateTime.minute % 15
        val endMinutes = endDateTime.minute - endMinutesMod
        val realEnd = endDateTime.withMinute(endMinutes)
//        log.info("End minutes: ${endDateTime.minute} end minutes mod: ${endMinutesMod} end minutes mod rounded: ${endMinutes}")

        val auction = Auction(
                durationDays = listingInfo.expireInDays,
                endDateTime = realEnd,
                bidIncrement = auctionListingInfo.bidIncrement,
                startingBid = auctionListingInfo.startingBid,
                buyItNow = auctionListingInfo.buyItNow,
                deck = deck,
                seller = currentUser,
                language = listingInfo.language,
                condition = listingInfo.condition,
                externalLink = listingInfo.externalLink,
                listingInfo = listingInfo.listingInfo,
                forSaleInCountry = currentUser.country ?: throw BadRequestException("You must have selected a country to list decks for sale."),
                currencySymbol = currentUser.currencySymbol
        )
        auctionRepo.save(auction)
        deckRepo.save(deck.copy(forAuction = true, auctionEnd = realEnd, listedOn = listingDate))
        userRepo.save(currentUser.copy(mostRecentDeckListing = listingDate))
    }

    fun bid(auctionId: UUID, bid: Int): BidPlacementResult {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = auctionRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")
        val requiredBid = auction.nextBid
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
        if (auction.status != AuctionStatus.ACTIVE || now.isAfter(auction.endDateTime)) {
            return BidPlacementResult(false, false, "Sorry, you couldn't buy it now because the auction has ended.")
        }
        if (user.id == auction.seller.id) {
            throw UnauthorizedException("You can't buy your own deck.")
        }
        if (auction.buyItNow == null) throw BadRequestException("Can't buy it now when the auction doesn't have buy it now.")

        endAuction(true, auction, user)

        return BidPlacementResult(
                true,
                true,
                "You have won the auction with your buy it now."
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
        deckRepo.save(auction.deck.copy(forAuction = false, completedAuction = sold))

        GlobalScope.launch {
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
        }
    }

    fun cancel(deckId: Long): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auctions = auctionRepo.findBySellerIdAndDeckIdAndStatus(user.id, deckId, AuctionStatus.ACTIVE)
        if (auctions.size > 1) {
            throw IllegalStateException("Seller shouldn't have more than one active auction for a single deck ${user.username} deckId: ${deckId}")
        }
        if (auctions.isEmpty()) return true
        val auction = auctions[0]
        if (auction.bids.isNotEmpty()) return false
        val auctionsForDeck = auction.deck.auctions
        if (auctionsForDeck.filter { it.status == AuctionStatus.ACTIVE }.size < 2) {
            deckRepo.save(auction.deck.copy(forAuction = false))
        }
        auctionRepo.delete(auction)
        return true
    }
}
