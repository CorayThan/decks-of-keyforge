package coraythan.keyswap.decks.ownership

import org.springframework.data.repository.CrudRepository
import java.util.*

interface DeckOwnershipRepo : CrudRepository<DeckOwnership, Long> {
    fun deleteAllByDeckIdAndUserId(deckId: Long, userId: UUID)
    fun findByDeckIdAndUserId(deckId: Long, userId: UUID): DeckOwnership?
    fun findByDeckId(deckId: Long): List<DeckOwnership>
    fun existsByDeckId(deckId: Long): Boolean
    fun existsByDeckIdAndUserId(deckId: Long, userId: UUID): Boolean
    fun findByUserId(userId: UUID): List<DeckOwnership>
}
