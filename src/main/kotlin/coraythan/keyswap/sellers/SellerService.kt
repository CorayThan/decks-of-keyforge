package coraythan.keyswap.sellers

import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.toLocalDateWithOffsetMinutes
import coraythan.keyswap.users.KeyUserRepo
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

    private var featuredSellersCache: List<SellerDetailsWithFullDate> = listOf()
    private val placeholderDate = LocalDate.parse("2019-04-07")

    @Scheduled(fixedDelayString = "PT5M")
    fun refreshFeaturedSellers() {
        featuredSellersCache = userRepo.findByPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER)
                .plus(userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                .sortedByDescending { it.mostRecentDeckListing }
                .plus(userRepo.findByEmailIgnoreCase("coraythan@gmail.com"))
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
