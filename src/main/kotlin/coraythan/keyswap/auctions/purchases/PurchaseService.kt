package coraythan.keyswap.auctions.purchases

import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.DeckSasValuesSearchableRepo
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.onceEverySixHoursLock
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.scheduledStart
import coraythan.keyswap.scheduledStop
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import kotlin.math.roundToInt

@Service
@Transactional
class PurchaseService(
    private val dsvsRepo: DeckSasValuesSearchableRepo,
    private val purchaseRepo: PurchaseRepo,
    private val currentUserService: CurrentUserService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private var purchaseStats: PurchaseStats? = null

    @Scheduled(fixedDelayString = onceEverySixHoursLock, initialDelayString = SchedulingConfig.purchasesInitialDelay)
    fun calculatePurchaseStats() {
        log.info("$scheduledStart purchase stats update")

        val purchases = purchaseRepo.findByPurchasedOnAfter(LocalDateTime.now().minusMonths(2))

        val deckSases = purchases.map {
            it.deck.id to dsvsRepo.findSasForDeckId(it.deck.id)
        }.toMap()

        purchaseStats = PurchaseStats(
                standardCount = purchaseRepo.countBySaleType(SaleType.STANDARD),
                offerCount = purchaseRepo.countBySaleType(SaleType.OFFER),
                auctionCount = purchaseRepo.countBySaleType(SaleType.AUCTION),
                data = purchases
                        .groupBy { Pair(it.currencySymbol, it.deck.expansion) }
                        .plus(purchases.groupBy { Pair(it.currencySymbol, null) })
                        .filter { it.value.size > 50 }
                        .map { purchasesData ->
                            val expansionInt = purchasesData.key.second
                            PurchaseCurrencyData(
                                    currency = purchasesData.key.first ?: "Unknown",
                                    expansion = if (expansionInt == null) null else Expansion.forExpansionNumber(expansionInt),
                                    data = purchasesData.value
                                            .groupBy { deckSases[it.deck.id]!! }
                                            .map { purchasesForSas ->
                                                PurchaseAmountData(
                                                        amount = purchasesForSas.value.map { it.saleAmount }.average().roundToInt(),
                                                        sas = purchasesForSas.key,
                                                        count = purchasesForSas.value.size
                                                )
                                            }
                                            .sortedBy { it.sas }
                            )
                        }
        )
        log.info("$scheduledStop purchase stats update")
    }

    fun findPurchaseStats() = this.purchaseStats

    fun savePurchase(saleType: SaleType, saleAmount: Int, deck: Deck, seller: KeyUser?, buyer: KeyUser?) {
        purchaseRepo.save(Purchase(
                deck = deck,
                seller = seller,
                buyer = buyer,
                saleType = saleType,
                saleAmount = saleAmount,
                currencySymbol = seller?.currencySymbol ?: buyer?.currencySymbol,
                sellerCountry = seller?.country,
                buyerCountry = buyer?.country
        ))
    }

    fun findPurchases(offsetMinutes: Int): Purchases {
        val loggedInUser = currentUserService.loggedInUserOrUnauthorized()
        val patTier = loggedInUser.realPatreonTier()
        val limit = patTier == null || patTier.ordinal < PatreonRewardsTier.SUPPORT_SOPHISTICATION.ordinal
        return Purchases(
                myPurchases = purchaseRepo.findByBuyerId(loggedInUser.id).sortConvertLimit(offsetMinutes, limit),
                mySales = purchaseRepo.findBySellerId(loggedInUser.id).sortConvertLimit(offsetMinutes, limit)
        )
    }

    private fun List<Purchase>.sortConvertLimit(offsetMinutes: Int, limit: Boolean) = this.sortedByDescending { it.purchasedOn }.map { it.toSearchResult(offsetMinutes) }.take(if (limit) 10 else this.size)
}
