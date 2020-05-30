package coraythan.keyswap.cards

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface CardRepo : JpaRepository<Card, String>, QuerydslPredicateExecutor<Card> {
    fun findByMaverickFalse(): List<Card>
    fun findByExpansionAndCardTitle(expansion: Int, cardTitle: String): List<Card>
    fun findByExpansion(expansion: Int): List<Card>
    fun findByCardTitleAndMaverickFalse(cardTitle: String): List<Card>
}
