package coraythan.keyswap.userdeck

import org.springframework.data.repository.CrudRepository
import java.util.*

interface PreviouslyOwnedDeckRepo : CrudRepository<PreviouslyOwnedDeck, Long> {
    fun existsByDeckIdAndPreviousOwnerId(deckId: Long, ownerId: UUID): Boolean
    fun deleteByDeckIdAndPreviousOwnerId(deckId: Long, ownerId: UUID)
}
