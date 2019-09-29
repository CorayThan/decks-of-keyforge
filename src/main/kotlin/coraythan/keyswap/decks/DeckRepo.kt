package coraythan.keyswap.decks

import coraythan.keyswap.decks.models.Deck
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

@Transactional
interface DeckRepo : JpaRepository<Deck, Long>, QuerydslPredicateExecutor<Deck> {
    fun findByKeyforgeId(keyforgeId: String): Deck?

    @Query("SELECT d from Deck d where LOWER(name) LIKE ?1")
    fun findByNameIgnoreCase(@Param("name") name: String): List<Deck>

    fun findAllByRegisteredFalse(): List<Deck>
    fun findByRegisteredTrueAndCardNames(cardNames: String): List<Deck>

    fun findByNameAndRegisteredTrue(name: String): Deck?
    fun findByName(name: String): Deck?

    fun findByWinsGreaterThanOrLossesGreaterThan(wins: Int, losses: Int): List<Deck>

    @Query(
            value = "SELECT reltuples\\:\\:BIGINT AS estimate FROM pg_class WHERE relname='deck'",
            nativeQuery = true
    )
    fun estimateRowCount(): Long

    fun countByRegisteredTrue(): Long

    @Modifying
    @Query("UPDATE Deck deck SET deck.crucibleTrackerWins = :crucibleTrackerWins, deck.crucibleTrackerLosses = :crucibleTrackerLosses WHERE deck.id = :id")
    fun  updateCrucibleTrackerWins(
            @Param("id") id: Long,
            @Param("crucibleTrackerWins") crucibleTrackerWins: Int,
            @Param("crucibleTrackerLosses") crucibleTrackerLosses: Int
    )
}
