package coraythan.keyswap.auctions.purchases

import java.util.*

data class CreatePurchase(
    val deckId: Long,
    val amount: Int,
    val saleType: SaleType,
    val buyerId: UUID? = null,
    val sellerId: UUID? = null
)
