package coraythan.keyswap.cards

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface ExtraCardInfoRepo : JpaRepository<ExtraCardInfo, Long>, QuerydslPredicateExecutor<ExtraCardInfo> {
    fun findByActiveTrue(): List<ExtraCardInfo>
    fun findByVersion(version: Int): List<ExtraCardInfo>
}
