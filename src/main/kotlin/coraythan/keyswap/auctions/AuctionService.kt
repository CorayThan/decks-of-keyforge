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
        private val emailService: EmailService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "completeAuctions", lockAtMostForString = fourteenMin, lockAtLeastForString = fourteenMin)
    fun completeAuctions() {
        log.info("$scheduledStart complete auctions.")

        val auctionsToComplete = auctionRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(AuctionStatus.ACTIVE, now())
        val allAuctions = auctionRepo.findAll()
                .toList()
        val auctionsToCompleteFromCode = allAuctions
                .filter { it.status == AuctionStatus.ACTIVE && it.endDateTime < now().plusDays(1) }

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
        listingInfo.expireInDays ?: throw BadRequestException("Must include expires in days for auctions.")

        val deck = deckRepo.findByIdOrNull(listingInfo.deckId) ?: throw IllegalStateException("No deck with id ${listingInfo.deckId}")

        if (deck.forAuction) throw BadRequestException("This deck is already listed as an auction.")

        val endDateTime = now().plusDays(listingInfo.expireInDays.toLong())
        val endMinutesMod = endDateTime.minute % 15
        val endMinutes = endDateTime.minute - endMinutesMod
//        log.info("End minutes: ${endDateTime.minute} end minutes mod: ${endMinutesMod} end minutes mod rounded: ${endMinutes}")

        val auction = Auction(
                durationDays = listingInfo.expireInDays,
                endDateTime = endDateTime.withMinute(endMinutes),
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
        deckRepo.save(deck.copy(forAuction = true))
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
        val dto = auction.toDto(offsetMinutes)
        if (auction.endDateTime.plusDays(14) < now()) {
            // auction is two weeks old, show real usernames
            return dto
        }
        val highestBidId = auction.realMaxBidObject()?.id
        val fakeUsernames = dto.bids.map { it.bidderUsername }.toSortedSet().reversed()
        return dto.copy(bids = dto.bids.map {
            it.copy(
                    bidderUsername = "User ${fakeUsernames.indexOf(it.bidderUsername) + 1}",
                    highest = it.id == highestBidId
            )
        })
    }

    private fun endAuction(sold: Boolean, auction: Auction, buyItNowUser: KeyUser? = null) {

        auctionRepo.save(auction.copy(
                status = AuctionStatus.COMPLETE,
                boughtWithBuyItNow = buyItNowUser,
                boughtNowOn = if (buyItNowUser == null) null else now()
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
}
