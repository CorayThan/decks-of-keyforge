package coraythan.keyswap.spoilers

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface SpoilerRepo : JpaRepository<Spoiler, Long>, QuerydslPredicateExecutor<Spoiler> {
    fun findByCardNumberAndExpansion(cardNumber: String, expansion: Int): List<Spoiler>
}
