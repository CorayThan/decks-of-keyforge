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

    fun countByExpansion(expansion: Int): Long

    @Query(
        value = "SELECT * FROM deck d WHERE (d.refreshed_bonus_icons IS NULL OR d.refreshed_bonus_icons = true) LIMIT 1000",
        nativeQuery = true
    )
    fun findTop1000ByRefreshedBonusIconsIsTrueOrNull(): List<Deck>
    @Query(value = "SELECT COUNT(d) FROM Deck d WHERE (d.refreshedBonusIcons IS NULL OR d.refreshedBonusIcons = true)")
    fun countByRefreshedBonusIconsIsTrueOrNull(): Long
}
