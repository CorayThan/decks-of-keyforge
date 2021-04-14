package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class OwnedDeck(

        @ManyToOne
        val owner: KeyUser,

        @JsonIgnoreProperties("ownedDecks")
        @ManyToOne
        val deck: Deck,

        val teamId: UUID?,

        val added: LocalDateTime = nowLocal(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

interface OwnedDeckRepo : CrudRepository<OwnedDeck, Long> {
        fun existsByDeckIdAndOwnerId(deckId: Long, ownerId: UUID): Boolean
        fun deleteByDeckIdAndOwnerId(deckId: Long, ownerId: UUID)

        @Modifying
        @Query("UPDATE OwnedDeck ownedDeck SET ownedDeck.teamId = ?1 WHERE ownedDeck.owner.id = ?2")
        fun addTeamForUser(teamId: UUID, userId: UUID)

        @Modifying
        @Query("UPDATE OwnedDeck ownedDeck SET ownedDeck.teamId = null WHERE ownedDeck.owner.id = ?1")
        fun removeTeamForUser(username: UUID)
}
