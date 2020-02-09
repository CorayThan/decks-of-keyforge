package coraythan.keyswap.auctions

import coraythan.keyswap.*
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.salenotifications.ForSaleNotificationsService
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.userdeck.UserDeckRepo
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import coraythan.keyswap.users.search.UserSearchService
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import net.javacrumbs.shedlock.core.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.LocalTime
import java.util.*

private const val fourteenMin = "PT14M"

@Service
@Transactional
class DeckListingService(
        private val deckListingRepo: DeckListingRepo,
        private val currentUserService: CurrentUserService,
        private val deckRepo: DeckRepo,
        private val emailService: EmailService,
        private val forSaleNotificationsService: ForSaleNotificationsService,
        private val userRepo: KeyUserRepo,
        private val userSearchService: UserSearchService,
        private val userDeckRepo: UserDeckRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private var cleanListings = mutableListOf<UUID>()

    @Transactional(propagation = Propagation.NEVER)
    @Scheduled(fixedDelayString = "PT1000H")
    @SchedulerLock(name = "clearUnownedForSale2", lockAtMostForString = "PT1000H", lockAtLeastForString = "PT1000H")
    fun clearUnownedForSaleDecks() {
        try {
            val toClear = deckListingRepo.findByStatusEquals(DeckListingStatus.BUY_IT_NOW_ONLY)
            log.info("Start clearing out unowned for sale decks to clear: ${toClear.size}")
            var count = 0
            var cleared = 0
            toClear.forEach {
                count++
                if (count % 1000 == 0) log.info("Checking deck to clear out $count")
                val owned = userDeckRepo.existsByDeckIdAndOwnedBy(it.deck.id, it.seller.username)
                if (!owned) {
                    try {
                        log.info("Listing with deck id ${it.deck.keyforgeId} is not owned by ${it.seller.username}")
                        cleared++
                        cleanListings.add(it.id)
                    } catch (e: Throwable) {
                        log.error("$scheduledException Exception unlisting deck ${it.deck.keyforgeId}", e)
                    }
                }
            }
            log.info("Done clearing out unowned for sale decks, cleared $cleared")
        } catch (e: Throwable) {
            log.error("$scheduledException Couldn't clear unowned for sale decks", e)
        }
    }

    @Scheduled(fixedDelayString = "PT10M", initialDelayString = "PT2M")
    fun cleanOutDecks() {
        val toClean = cleanListings.toMutableList()
        cleanListings = mutableListOf()
        log.info("Clean out $toClean")
        toClean.forEach {
            val listing = deckListingRepo.findByIdOrNull(it) ?: throw IllegalStateException("No deck listing for id $it")
            updateDeckListingStatus(listing)
            deckListingRepo.delete(listing)
        }
        log.info("Done cleaning")
    }

    @Scheduled(fixedDelayString = "PT6H", initialDelayString = SchedulingConfig.unexpiredDecksInitialDelay)
    fun unlistExpiredDecks() {
        try {
            log.info("$scheduledStart unlisting expired for sale decks.")

            val buyItNowsToComplete = deckListingRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(DeckListingStatus.BUY_IT_NOW_ONLY, now())

            buyItNowsToComplete.forEach {
                updateDeckListingStatus(it)
                deckListingRepo.delete(it)
            }

            log.info("$scheduledStop unlisting expired for sale decks.")
        } catch (e: Throwable) {
            log.error("$scheduledException Couldn't unlist expired decks", e)
        }
    }

    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "completeAuctions", lockAtMostForString = fourteenMin, lockAtLeastForString = fourteenMin)
    fun completeAuctions() {
        try {
            log.info("$scheduledStart complete auctions.")

            val auctionsToComplete = deckListingRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(DeckListingStatus.ACTIVE, now())

            auctionsToComplete.forEach {
                val buyer = it.highestBidder()
                log.info("Auction to complete: ${it.endDateTime}")
                endAuction(buyer != null, it)
            }

            log.info("$scheduledStop complete auctions.")
        } catch (e: Throwable) {
            log.error("$scheduledException Couldn't complete auctions", e)
        }
    }

    fun list(listingInfo: ListingInfo, offsetMinutes: Int) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        val status = if (!listingInfo.auction) {
            DeckListingStatus.BUY_IT_NOW_ONLY
        } else {
            if (listingInfo.bidIncrement == null || listingInfo.bidIncrement < 1) throw BadRequestException("Bid increment must not be null or less than 1.")
            DeckListingStatus.ACTIVE
        }
        listingInfo.expireInDays ?: throw BadRequestException("Must include expires in days for auctions.")

        val deck = deckRepo.findByIdOrNull(listingInfo.deckId) ?: throw IllegalStateException("No deck with id ${listingInfo.deckId}")

        if (!deck.registered) throw BadRequestException("Unregistered decks cannot be listed for sale.")
        if (deck.forAuction) throw BadRequestException("This deck is already listed as an auction.")

        val listingDate = now()
        val endTime = listingInfo.endTimeLocalTime?.withOffsetMinutes(offsetMinutes) ?: LocalTime.now()
        val endDateTime = listingDate.plusDays(listingInfo.expireInDays.toLong())
                .withHour(endTime.hour)
                .withMinute(endTime.minute)
        val endMinutesMod = endDateTime.minute % 15
        val endMinutes = endDateTime.minute - endMinutesMod
        val realEnd = endDateTime.withMinute(endMinutes)
//        log.info("End minutes: ${endDateTime.minute} end minutes mod: ${endMinutesMod} end minutes mod rounded: ${endMinutes}")

        val auction = if (listingInfo.editAuctionId == null) {
            val preexistingListing = deckListingRepo.findBySellerIdAndDeckIdAndStatusNot(currentUser.id, listingInfo.deckId, DeckListingStatus.COMPLETE)
            if (preexistingListing.isNotEmpty()) throw BadRequestException("You've already listed this deck for sale.")
            DeckListing(
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
                    status = status,
                    forTrade = currentUser.allowsTrades,
                    shippingCost = currentUser.shippingCost
            )
        } else {
            deckListingRepo.findByIdOrNull(listingInfo.editAuctionId)!!
                    .copy(
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
                            status = status,
                            forTrade = currentUser.allowsTrades,
                            shippingCost = currentUser.shippingCost
                    )
        }
        deckListingRepo.save(auction)
        if (listingInfo.auction) {
            // for auction
            deckRepo.save(deck.copy(forAuction = true, auctionEnd = realEnd, listedOn = listingDate, forSale = true))
        } else {
            deckRepo.save(deck.copy(forSale = true, forTrade = currentUser.allowsTrades))
        }
        userRepo.save(currentUser.copy(mostRecentDeckListing = listingDate, updateStats = true))
        forSaleNotificationsService.sendNotifications(listingInfo)
    }

    fun bid(auctionId: UUID, bid: Int): BidPlacementResult {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = deckListingRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")
        val requiredBid = auction.nextBid ?: throw BadRequestException("Cannot bid on a sale that is not an auction, id $auctionId")
        val now = now()
        if (auction.status != DeckListingStatus.ACTIVE || now.isAfter(auction.endDateTime)) {
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

        val saved = deckListingRepo.save(withBid)
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
        val auction = deckListingRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction for id $auctionId")
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

    fun deckListingInfo(auctionId: UUID, offsetMinutes: Int): DeckListingDto {
        val auction = deckListingRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No auction with id $auctionId")
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

    private fun endAuction(sold: Boolean, auction: DeckListing, buyItNowUser: KeyUser? = null) {

        val end = now()
        deckListingRepo.save(auction.copy(
                status = DeckListingStatus.COMPLETE,
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

    fun cancelListing(deckId: Long): Boolean {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auctions = deckListingRepo.findBySellerIdAndDeckIdAndStatusNot(user.id, deckId, DeckListingStatus.COMPLETE)
        if (auctions.size > 1) {
            log.error("Seller shouldn't have more than one active auction for a single deck ${user.username} deckId: ${deckId}")
        }
        if (auctions.isEmpty()) return true
        val auction = auctions[0]
        if (auction.status == DeckListingStatus.ACTIVE) {
            if (auction.bids.isNotEmpty()) return false
        }
        updateDeckListingStatus(auction)
        deckListingRepo.delete(auction)
        return true
    }

    fun findActiveListingsForUser(): List<UserDeckListingInfo> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return deckListingRepo.findAllBySellerIdAndStatusNot(currentUser.id, DeckListingStatus.COMPLETE)
                .map { it.toUserDeckListingInfo() }
    }

    private fun updateDeckListingStatus(listing: DeckListing, sold: Boolean = false) {
        val auctionsForDeck = listing.deck.auctions
        val otherListingsForDeck = auctionsForDeck
                .filter { it.isActive && it.id != listing.id }

        // This might be someone else unlisting the deck for sale while a different person has an active auction for it
        val stillForAuction = otherListingsForDeck.any { it.status == DeckListingStatus.ACTIVE }
        val stillForTrade = otherListingsForDeck.any { it.forTrade }
        deckRepo.save(listing.deck.copy(
                forAuction = stillForAuction,
                auctionEnd = if (stillForAuction) listing.deck.auctionEnd else null,
                listedOn = if (stillForAuction) listing.deck.listedOn else null,
                forSale = otherListingsForDeck.isNotEmpty(),
                forTrade = stillForTrade,
                completedAuction = sold || listing.deck.completedAuction
        ))
        userSearchService.scheduleUserForUpdate(listing.seller)
    }

}
