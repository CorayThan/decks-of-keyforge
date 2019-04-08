package coraythan.keyswap.sellers

import coraythan.keyswap.generic.Country
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.users.KeyUserRepo
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Transactional
@Service
class SellerService(
        private val userRepo: KeyUserRepo
) {

    private var featuredSellersCache: List<SellerDetails> = listOf()

    @Scheduled(fixedDelayString = "PT3M")
    fun refreshFeaturedSellers() {
        featuredSellersCache = userRepo.findByPatreonTier(PatreonRewardsTier.MERCHANT_AEMBERMAKER)
                .plus(userRepo.findByPatreonTier(PatreonRewardsTier.ALWAYS_GENEROUS))
                .filter { user -> user.decks.filter { it.forSale || it.forTrade }.size > 9 }
                .sortedByDescending { it.mostRecentDeckListing }
                .plus(userRepo.findByEmailIgnoreCase("coraythan@gmail.com"))
                .filterNotNull()
                .map { user ->
                    SellerDetails(
                            storeName = user.storeName ?: "${user.username}'s Store",
                            username = user.username,
                            decksAvailable = user.decks.filter { it.forSale || it.forTrade }.size,
                            country = user.country ?: Country.UnitedStates,
                            mostRecentListing = user.mostRecentDeckListing?.toLocalDate() ?: LocalDate.parse("2019-04-07"),
                            storeDescription = user.publicContactInfo,
                            discord = user.discord,
                            email = user.sellerEmail
                    )
                }
    }

    fun featuredSellers(): List<SellerDetails> {
        return featuredSellersCache
    }
}
