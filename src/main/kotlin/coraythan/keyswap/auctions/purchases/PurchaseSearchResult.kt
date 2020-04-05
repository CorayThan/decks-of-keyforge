package coraythan.keyswap.auctions.purchases

import coraythan.keyswap.generic.Country
import java.util.*

data class PurchaseSearchResult(
        val id: UUID,
        val deckKeyforgeId: String,
        val deckName: String,
        val saleAmount: Int,
        val saleType: SaleType,
        val purchasedOn: String,
        val currencySymbol: String? = null,
        val sellerCountry: Country? = null,
        val buyerCountry: Country? = null,
        val sellerUsername: String? = null,
        val buyerUsername: String? = null
)
