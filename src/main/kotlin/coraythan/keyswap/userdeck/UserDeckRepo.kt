package coraythan.keyswap.userdeck

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface UserDeckRepo : JpaRepository<DeckNote, UUID>, QuerydslPredicateExecutor<DeckNote> {

    fun findByUserIdAndDeckId(userId: UUID, deckId: Long): DeckNote?

}
