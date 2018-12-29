package coraythan.keyswap.userdeck

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface UserDeckRepo : JpaRepository<UserDeck, UUID>, QuerydslPredicateExecutor<UserDeck> {
    fun findByDeckId(id: Long): List<UserDeck>
}
