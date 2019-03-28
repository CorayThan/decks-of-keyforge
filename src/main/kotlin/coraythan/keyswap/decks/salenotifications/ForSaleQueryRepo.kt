package coraythan.keyswap.decks.salenotifications

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface ForSaleQueryRepo: JpaRepository<ForSaleQueryEntity, UUID>, QuerydslPredicateExecutor<ForSaleQueryEntity> {
    fun findByUserId(userId: UUID): List<ForSaleQueryEntity>
}
