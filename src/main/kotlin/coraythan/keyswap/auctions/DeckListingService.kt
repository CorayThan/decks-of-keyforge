package coraythan.keyswap.auctions

import coraythan.keyswap.*
import coraythan.keyswap.auctions.purchases.*
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.decks.ownership.DeckOwnershipRepo
import coraythan.keyswap.decks.salenotifications.ForSaleNotificationsService
import coraythan.keyswap.emails.EmailService
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.userdeck.UserDeckService
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserRepo
import coraythan.keyswap.users.search.UserSearchService
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZonedDateTime
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
        private val purchaseService: PurchaseService,
        private val purchaseRepo: PurchaseRepo,
        private val userDeckService: UserDeckService,
        private val deckOwnershipRepo: DeckOwnershipRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Scheduled(fixedDelayString = "PT6H", initialDelayString = SchedulingConfig.unexpiredDecksInitialDelay)
    fun unlistExpiredDecks() {
        try {
            log.info("$scheduledStart unlisting expired for sale decks.")

            val buyItNowsToComplete = deckListingRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(DeckListingStatus.SALE, now())

            buyItNowsToComplete.forEach {

                if (it.seller.autoRenewListings && it.seller.realPatreonTier() != null) {
                    deckListingRepo.save(it.copy(endDateTime = ZonedDateTime.now().plusYears(1)))
                } else {
                    removeDeckListingStatus(it)
                    deckListingRepo.delete(it)
                }
            }

            log.info("$scheduledStop unlisting expired for sale decks.")
        } catch (e: Throwable) {
            log.error("$scheduledException Couldn't unlist expired decks", e)
        }
    }

    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "completeAuctions", lockAtMostFor = fourteenMin, lockAtLeastFor = fourteenMin)
    fun completeAuctions() {
        try {
            log.info("$scheduledStart complete auctions.")

            val auctionsToComplete = deckListingRepo.findAllByStatusEqualsAndEndDateTimeLessThanEqual(DeckListingStatus.AUCTION, now())

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
            DeckListingStatus.SALE
        } else {
            if (listingInfo.bidIncrement == null || listingInfo.bidIncrement < 1) throw BadRequestException("Bid increment must not be null or less than 1.")
            DeckListingStatus.AUCTION
        }
        listingInfo.expireInDays ?: throw BadRequestException("Must include expires in days for auctions.")
        if (listingInfo.auction && listingInfo.acceptingOffers) throw BadRequestException("Can't do offers and auction.")

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

        val hasOwnershipVerification = deckOwnershipRepo.existsByDeckIdAndUserId(deck.id, currentUser.id)

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
                    shippingCost = currentUser.shippingCost,
                    acceptingOffers = listingInfo.acceptingOffers,
                    hasOwnershipVerification = hasOwnershipVerification
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
                            shippingCost = currentUser.shippingCost,
                            acceptingOffers = listingInfo.acceptingOffers,
                            hasOwnershipVerification = hasOwnershipVerification
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
        if (auction.status != DeckListingStatus.AUCTION || now.isAfter(auction.endDateTime)) {
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

    fun offerAccepted(deckId: Long) {
        cancelListing(deckId)
    }

    fun buyItNow(auctionId: UUID): BidPlacementResult {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val auction = deckListingRepo.findByIdOrNull(auctionId) ?: throw BadRequestException("No sale listing for id $auctionId")
        if (auction.buyItNow == null) throw BadRequestException("Can't buy it now when the auction doesn't have buy it now.")
        if (user.id == auction.seller.id) throw UnauthorizedException("You can't buy your own deck.")
        if (auction.status == DeckListingStatus.COMPLETE) throw BadRequestException("Can't buy it now because it has already sold.")

        if (auction.status != DeckListingStatus.AUCTION) {
            // non auction

            removeDeckListingStatus(auction)

            deckListingRepo.delete(auction)

            emailService.sendBoughtNowEmail(
                    user,
                    auction.seller,
                    auction.deck,
                    auction.buyItNow
            )
            purchaseService.savePurchase(
                    saleType = auction.saleType,
                    saleAmount = auction.buyItNow,
                    deck = auction.deck,
                    seller = auction.seller,
                    buyer = user
            )
        } else {
            // Auction
            val now = now()
            if (now.isAfter(auction.endDateTime)) {
                return BidPlacementResult(false, false, "Sorry, you couldn't buy it now because the sale has ended.")
            }

            endAuction(true, auction, user)
            val previousHighBidder = auction.highestBidder()
            if (previousHighBidder != null && previousHighBidder != user) {
                emailService.sendSomeoneElseBoughtNowEmail(previousHighBidder, auction.deck)
            }
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

        removeDeckListingStatus(auction, sold)

        GlobalScope.launch {
            try {
                if (sold) {
                    val saleAmount = if (buyItNowUser != null) auction.buyItNow!! else auction.highestBid!!
                    val buyer = buyItNowUser ?: auction.highestBidder()!!
                    purchaseService.savePurchase(
                            saleType = SaleType.AUCTION,
                            saleAmount = saleAmount,
                            deck = auction.deck,
                            seller = auction.seller,
                            buyer = buyer
                    )
                    emailService.sendAuctionPurchaseEmail(
                            buyer,
                            auction.seller,
                            auction.deck,
                            saleAmount
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
        if (auction.status == DeckListingStatus.AUCTION) {
            if (auction.bids.isNotEmpty()) return false
        }
        removeDeckListingStatus(auction)
        deckListingRepo.delete(auction)
        return true
    }

    fun findActiveListingsForUser(): List<UserDeckListingInfo> {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        return deckListingRepo.findAllBySellerIdAndStatusNot(currentUser.id, DeckListingStatus.COMPLETE)
                .map { it.toUserDeckListingInfo() }
    }

    // This being in Purchase Service creates a dependency cycle
    fun createPurchase(createPurchase: CreatePurchase, verifyNoMatchingPurchases: Boolean = false): CreatePurchaseResult {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val deck = deckRepo.findByIdOrNull(createPurchase.deckId) ?: throw BadRequestException("No deck for id ${createPurchase.deckId}")
        val seller = if (createPurchase.sellerId == null) null else userRepo.findByIdOrNull(createPurchase.sellerId)
        val buyer = if (createPurchase.buyerId == null) null else userRepo.findByIdOrNull(createPurchase.buyerId)
        if (seller == null && buyer == null) throw BadRequestException("One of buyer or seller must exist. Seller id: ${createPurchase.sellerId} buyer id: ${createPurchase.buyerId}")
        if (seller?.id != loggedInUser.id && buyer?.id != loggedInUser.id) throw BadRequestException("You must be the buyer or seller! Seller id: ${createPurchase.sellerId} buyer id: ${createPurchase.buyerId}")

        if (verifyNoMatchingPurchases && buyer != null && purchaseRepo.existsByDeckIdAndBuyerId(createPurchase.deckId, buyer.id)) {
            return  CreatePurchaseResult(
                    createdOrUpdated = false,
                    message = "You already have a purchase recorded for ${deck.name}."
            )
        }

        if (seller == null) {
            // reporting a purchase
            val preexisting = purchaseRepo.findByDeckId(createPurchase.deckId)
                    .filter { it.buyer == null && it.purchasedOn.isAfter(LocalDateTime.now().minusDays(7)) && it.saleAmount == createPurchase.amount }
                    .minBy { it.purchasedOn }
            if (preexisting != null) {
                purchaseRepo.save(preexisting.copy(buyer = buyer, buyerCountry = buyer?.country))
                return CreatePurchaseResult(
                        createdOrUpdated = true,
                        message = "Added you as the buyer of ${deck.name}."
                )
            }
        } else if (buyer == null) {
            // reporting a sale
            this.cancelListing(deck.id)
            userDeckService.markAsOwned(deck.id, false)
            val preexisting = purchaseRepo.findByDeckId(createPurchase.deckId)
                    .filter { it.seller == null && it.purchasedOn.isAfter(LocalDateTime.now().minusDays(7)) && it.saleAmount == createPurchase.amount }
                    .minBy { it.purchasedOn }
            if (preexisting != null) {
                purchaseRepo.save(preexisting.copy(seller = seller, sellerCountry = seller.country, currencySymbol = seller.currencySymbol))
                return CreatePurchaseResult(
                        createdOrUpdated = true,
                        message = "Created sale record and removed ${deck.name} from your decks."
                )
            }
        }

        purchaseService.savePurchase(createPurchase.saleType, createPurchase.amount, deck, seller, buyer)
        return CreatePurchaseResult(
                createdOrUpdated = true,
                message = if (buyer == null) {
                    "Created sale record and removed ${deck.name} from your decks."
                } else {
                    "Created purchase record for ${deck.name}."
                }
        )
    }

    private fun removeDeckListingStatus(listing: DeckListing, soldOnAuction: Boolean = false) {
        val auctionsForDeck = listing.deck.auctions
        val otherListingsForDeck = auctionsForDeck
                .filter { it.isActive && it.id != listing.id }

        // This might be someone else unlisting the deck for sale while a different person has an active auction for it
        val stillForAuction = otherListingsForDeck.any { it.status == DeckListingStatus.AUCTION }
        val stillForTrade = otherListingsForDeck.any { it.forTrade }
        deckRepo.save(listing.deck.copy(
                forAuction = stillForAuction,
                auctionEnd = if (stillForAuction) listing.deck.auctionEnd else null,
                listedOn = if (stillForAuction) listing.deck.listedOn else null,
                forSale = otherListingsForDeck.isNotEmpty(),
                forTrade = stillForTrade,
                completedAuction = soldOnAuction || listing.deck.completedAuction
        ))
        userSearchService.scheduleUserForUpdate(listing.seller)
    }

}
