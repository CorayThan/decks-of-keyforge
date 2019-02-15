package coraythan.keyswap.decks

import coraythan.keyswap.decks.models.Deck
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.data.repository.query.Param

interface DeckRepo : JpaRepository<Deck, Long>, QuerydslPredicateExecutor<Deck> {
    fun findByKeyforgeId(keyforgeId: String): Deck?

    @Query("SELECT d from Deck d where LOWER(name) LIKE ?1")
    fun findByNameIgnoreCase(@Param("name") name: String): List<Deck>

    fun findAllByRegisteredFalse(): List<Deck>

    fun findByNameAndRegisteredTrue(name: String): Deck?
    fun findByName(name: String): Deck?
}
