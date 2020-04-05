package coraythan.keyswap.auctions.purchases

import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.users.CurrentUserService
import coraythan.keyswap.users.KeyUser
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PurchaseService(
        private val purchaseRepo: PurchaseRepo,
        private val currentUserService: CurrentUserService
) {
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
        return Purchases(
                myPurchases = purchaseRepo.findByBuyerId(loggedInUser.id).map { it.toSearchResult(offsetMinutes) },
                mySales = purchaseRepo.findBySellerId(loggedInUser.id).map { it.toSearchResult(offsetMinutes) }
        )
    }

}
