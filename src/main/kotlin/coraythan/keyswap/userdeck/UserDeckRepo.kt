package coraythan.keyswap.userdeck

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface UserDeckRepo : JpaRepository<UserDeck, UUID>, QuerydslPredicateExecutor<UserDeck> {
    fun findByDeckIdAndOwnedByNotNull(deckId: Long): List<UserDeck>

    fun findByUserId(userId: UUID): List<UserDeck>

    fun existsByDeckIdAndOwnedBy(deckId: Long, ownedBy: String): Boolean

}
