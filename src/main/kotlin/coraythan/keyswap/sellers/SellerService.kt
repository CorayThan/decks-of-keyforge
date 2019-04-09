package coraythan.keyswap.sellers

import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.users.KeyUserRepo
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.ZonedDateTime

data class SellerDetailsWithFullDate(val mostRecent: ZonedDateTime?, val sellerDetails: SellerDetails)

@Transactional
@Service
class SellerService(
        private val userRepo: KeyUserRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private var featuredSellersCache: List<SellerDetailsWithFullDate> = listOf()
    private val placeholderDate = LocalDate.parse("2019-04-07")

    @Scheduled(fixedDelayString = "PT5M")
    fun refreshFeaturedSellers() {
        log.info("$scheduledStart refresh featured sellers.")
        featuredSellersCache = userRepo.findByPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER)
                .plus(userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                .sortedByDescending { it.mostRecentDeckListing }
                .plus(userRepo.findByEmailIgnoreCase("coraythan@gmail.com"))
                .plus(userRepo.findByUsernameIgnoreCase("Zarathustra05"))
                .filterNotNull()
                .filter { user -> user.decks.filter { it.forSale || it.forTrade }.size > 9 }
                .map { user ->
                    SellerDetailsWithFullDate(
                     user.mostRecentDeckListing,
                            SellerDetails(
                                    storeName = user.storeName ?: "${user.username}'s Store",
                                    username = user.username,
                                    decksAvailable = user.decks.filter { it.forSale || it.forTrade }.size,
                                    country = user.country ?: Country.UnitedStates,
                                    mostRecentListing = placeholderDate,
                                    storeDescription = user.publicContactInfo,
                                    discord = user.discord,
                                    email = user.sellerEmail
                            )
                    )
                }
        log.info("$scheduledStop refreshing featured sellers.")
    }

    fun featuredSellers(offsetMinutes: Int): List<SellerDetails> {
        return featuredSellersCache.map {
            it.sellerDetails.copy(
                    mostRecentListing =
                    it.mostRecent?.toLocalDateWithOffsetMinutes(offsetMinutes) ?: placeholderDate
            )
        }
    }
}
