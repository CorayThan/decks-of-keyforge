package coraythan.keyswap.userdeck

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import java.util.*

interface UserDeckRepo : JpaRepository<UserDeck, UUID>, QuerydslPredicateExecutor<UserDeck> {
    fun findByDeckIdAndOwnedByNotNull(deckId: Long): List<UserDeck>
    fun findByDeckIdAndTeamId(deckId: Long, teamId: UUID): List<UserDeck>

    fun findByUserId(userId: UUID): List<UserDeck>
    fun existsByUserIdAndDeckId(userId: UUID, deckId: Long): Boolean

    @Modifying
    @Query("UPDATE UserDeck userDeck SET userDeck.teamId = null WHERE userDeck.ownedBy = ?1")
    fun removeTeamForUser(username: String)

    @Modifying
    @Query("UPDATE UserDeck userDeck SET userDeck.teamId = ?1 WHERE userDeck.ownedBy = ?2")
    fun addTeamForUser(teamId: UUID, username: String)

}
