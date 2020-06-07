package coraythan.keyswap.auctions.purchases

import coraythan.keyswap.expansions.Expansion

data class PurchaseStats(
        val standardCount: Long,
        val offerCount: Long,
        val auctionCount: Long,

        val data: List<PurchaseCurrencyData>
)

data class PurchaseCurrencyData(
        val currency: String,
        val expansion: Expansion?,
        val data: List<PurchaseAmountData>
)

data class PurchaseAmountData(
        // Average
        val amount: Int,
        val sas: Int,
        val count: Int
)
