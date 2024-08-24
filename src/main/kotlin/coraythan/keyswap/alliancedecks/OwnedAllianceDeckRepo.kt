package coraythan.keyswap.alliancedecks

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.*

interface OwnedAllianceDeckRepo : CrudRepository<OwnedAllianceDeck, Long> {

    fun findByDeckId(deckId: UUID): List<OwnedAllianceDeck>
    fun findByDeckIdAndTeamId(deckId: UUID, teamId: UUID): List<OwnedAllianceDeck>
    fun deleteByDeckIdAndOwnerId(deckId: UUID, ownerId: UUID)
    fun findAllByOwnerId(ownerId: UUID): List<OwnedAllianceDeck>

    @Query("SELECT ownedAllianceDeck FROM OwnedAllianceDeck ownedAllianceDeck WHERE ownedAllianceDeck.deck.id = ?1 AND ownedAllianceDeck.owner.username IN ?2")
    fun findByDeckIdAndOwnedByIn(deckId: UUID, ownerUsernames: List<String>): List<OwnedAllianceDeck>

    @Modifying
    @Query("UPDATE OwnedAllianceDeck ownedAllianceDeck SET ownedAllianceDeck.teamId = ?1 WHERE ownedAllianceDeck.owner.id = ?2")
    fun addTeamForUser(teamId: UUID, userId: UUID)

    @Modifying
    @Query("UPDATE OwnedAllianceDeck ownedAllianceDeck SET ownedAllianceDeck.teamId = null WHERE ownedAllianceDeck.owner.id = ?1")
    fun removeTeamForUser(userId: UUID)

    fun existsByDeckIdAndOwnerId(deckId: UUID, ownerId: UUID): Boolean
}
