package coraythan.keyswap.auctions.purchases

import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*

interface PurchaseRepo : CrudRepository<Purchase, UUID> {
    fun findBySellerId(sellerId: UUID): List<Purchase>
    fun findByBuyerId(buyerId: UUID): List<Purchase>
    fun findByDeckId(deckId: Long): List<Purchase>
    fun existsByDeckIdAndBuyerId(deckId: Long, buyerId: UUID): Boolean

    fun findByPurchasedOnAfter(purchasedAfter: LocalDateTime): List<Purchase>

    fun countBySaleType(type: SaleType): Long
}
