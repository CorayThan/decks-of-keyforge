package coraythan.keyswap.cards

import coraythan.keyswap.House
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface CardRepo : JpaRepository<Card, String>, QuerydslPredicateExecutor<Card> {
    fun findByMaverickFalse(): List<Card>

    fun findByExpansionAndCardNumberAndHouse(expansion: Int, cardNumber: String, house: House): List<Card>
}
