package coraythan.keyswap.sellers

import coraythan.keyswap.auctions.AuctionRepo
import coraythan.keyswap.auctions.AuctionStatus
import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.userdeck.UpdatePrice
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.ZonedDateTime
import kotlin.system.measureTimeMillis

data class SellerDetailsWithFullDate(val mostRecent: ZonedDateTime?, val sellerDetails: SellerDetails)

@Transactional
@Service
class SellerService(
        private val userRepo: KeyUserRepo,
        private val currentUserService: CurrentUserService,
        private val auctionRepo: AuctionRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var featuredSellersCache: List<SellerDetailsWithFullDate> = listOf()
    private val placeholderDate = LocalDate.parse("2019-04-07")

    @Scheduled(fixedDelayString = "PT5M")
    fun refreshFeaturedSellers() {
        log.info("$scheduledStart refresh featured sellers.")
        val millisTaken = measureTimeMillis {
            featuredSellersCache = userRepo.findByPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER)
                    .plus(userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                    .plus(userRepo.findByManualPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER))
                    .plus(userRepo.findByManualPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                    .toSet()
                    .toList()
                    .sortedByDescending { it.mostRecentDeckListing }
                    .filter { user ->
                        (user.decks.filter { it.forSale || it.forTrade }.size + user.auctions.filter { it.status == AuctionStatus.ACTIVE }.size) > 9
                    }
                    .map { user ->
                        SellerDetailsWithFullDate(
                                user.mostRecentDeckListing,
                                SellerDetails(
                                        storeName = user.storeName ?: "${user.username}'s Store",
                                        username = user.username,
                                        decksAvailable = user.decks.filter { it.forSale || it.forTrade }.size +
                                                user.auctions.filter { it.status ==  AuctionStatus.ACTIVE}.size,
                                        country = user.country ?: Country.UnitedStates,
                                        mostRecentListing = placeholderDate,
                                        storeDescription = user.publicContactInfo,
                                        discord = user.discord,
                                        email = user.sellerEmail
                                )
                        )
                    }
        }
        log.info("$scheduledStop refreshing featured sellers. It took millis: $millisTaken")
    }

    fun featuredSellers(offsetMinutes: Int): List<SellerDetails> {
        return featuredSellersCache.map {
            it.sellerDetails.copy(
                    mostRecentListing =
                    it.mostRecent?.toLocalDateWithOffsetMinutes(offsetMinutes) ?: placeholderDate
            )
        }
    }

    fun updatePrices(prices: List<UpdatePrice>) {
        for (price in prices) {
            val currentUser = currentUserService.loggedInUserOrUnauthorized()
            val preexisting = auctionRepo.findBySellerIdAndDeckId(currentUser.id, price.deckId)
                    ?: throw IllegalArgumentException("There was no listing info for deck with id ${price.deckId}")
            auctionRepo.save(preexisting.copy(buyItNow = price.askingPrice))
        }
    }
}
