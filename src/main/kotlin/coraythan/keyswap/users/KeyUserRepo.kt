package coraythan.keyswap.users

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor

interface KeyUserRepo : JpaRepository<KeyUser, String>, QuerydslPredicateExecutor<KeyUser> {
    fun findByEmail(email: String): KeyUser?
    fun findByEmailIgnoreCase(email: String): KeyUser?
    fun findByUsernameIgnoreCase(username: String): KeyUser?
}
