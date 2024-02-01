package coraythan.keyswap.cards.dokcards

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface DokCardRepo : JpaRepository<DokCard, Long>, QuerydslPredicateExecutor<DokCard> {
    fun findByCardTitleUrl(cardTitleUrl: String): DokCard?
}
