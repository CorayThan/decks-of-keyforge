package coraythan.keyswap.sellers

import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.scheduledException
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.userdeck.UpdatePrice
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
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
         private val deckListingRepo: DeckListingRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var featuredSellersCache: List<SellerDetailsWithFullDate> = listOf()
    private val placeholderDate = LocalDate.parse("2019-04-07")

    @Scheduled(fixedDelayString = "PT5M")
    fun refreshFeaturedSellers() {
        try {

            log.info("$scheduledStart refresh featured sellers.")
            val millisTaken = measureTimeMillis {
                featuredSellersCache = userRepo.findByPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER)
                        .asSequence()
                        .plus(userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                        .plus(userRepo.findByManualPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER))
                        .plus(userRepo.findByManualPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                        .distinctBy { it.username }
                        .filter { user -> user.forSaleCount > 9 }
                        .sortedByDescending { it.mostRecentDeckListing }
                        .map { user ->
                            SellerDetailsWithFullDate(
                                    user.mostRecentDeckListing,
                                    SellerDetails(
                                            sellerId = user.id,
                                            storeName = user.storeName ?: "${user.username}'s Store",
                                            username = user.username,
                                            decksAvailable = user.forSaleCount,
                                            country = user.country ?: Country.UnitedStates,
                                            mostRecentListing = placeholderDate,
                                            storeDescription = user.publicContactInfo,
                                            discord = user.discord,
                                            email = user.sellerEmail
                                    )
                            )
                        }
                        .toList()
            }
            log.info("$scheduledStop refreshing featured sellers. It took millis: $millisTaken")
        } catch (e: Throwable) {
            log.error("$scheduledException refreshing featured sellers", e)
        }
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
        prices.forEach {
            val auction = deckListingRepo.findByIdOrNull(it.auctionId)
            if (auction != null) deckListingRepo.save(auction.copy(buyItNow = it.askingPrice))
        }
    }
}
