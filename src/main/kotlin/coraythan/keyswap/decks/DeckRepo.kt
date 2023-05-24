package coraythan.keyswap.decks

import coraythan.keyswap.decks.models.Deck
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.transaction.annotation.Transactional

@Transactional
interface DeckRepo : JpaRepository<Deck, Long>, QuerydslPredicateExecutor<Deck> {
    fun findByKeyforgeId(keyforgeId: String): Deck?

    fun findByWinsGreaterThanOrLossesGreaterThan(wins: Int, losses: Int): List<Deck>

    @Query(
        value = "SELECT reltuples\\:\\:BIGINT AS estimate FROM pg_class WHERE relname='deck'",
        nativeQuery = true
    )
    fun estimateRowCount(): Long

    fun existsByIdGreaterThan(idGreaterThan: Long): Boolean
}
