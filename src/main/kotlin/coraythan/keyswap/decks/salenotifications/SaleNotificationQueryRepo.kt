package coraythan.keyswap.decks.salenotifications

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.data.repository.CrudRepository
import java.util.*

interface SaleNotificationQueryRepo : JpaRepository<SaleNotificationQuery, Long>, QuerydslPredicateExecutor<SaleNotificationQuery> {
    fun findByUserId(userId: UUID): List<SaleNotificationQuery>
    fun countByUserId(userId: UUID): Long
}

interface SaleNotificationConstraintRepo : CrudRepository<SaleNotificationConstraint, Long>
interface SaleNotificationDeckCardQuantityRepo : CrudRepository<SaleNotificationDeckCardQuantity, Long>
