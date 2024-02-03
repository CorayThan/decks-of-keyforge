package coraythan.keyswap.cards.extrainfo

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface ExtraCardInfoRepo : JpaRepository<ExtraCardInfo, UUID>, QuerydslPredicateExecutor<ExtraCardInfo> {
    fun findByActiveTrue(): List<ExtraCardInfo>
    fun findFirstByActiveTrueOrderByVersionDesc(): ExtraCardInfo
    fun findByCardName(cardName: String): List<ExtraCardInfo>
    fun findByCardNameUrl(cardNameUrl: String): List<ExtraCardInfo>

    fun findByPublishedNullAndVersionLessThanEqual(version: Int): List<ExtraCardInfo>

    fun existsByCardName(name: String): Boolean
}
