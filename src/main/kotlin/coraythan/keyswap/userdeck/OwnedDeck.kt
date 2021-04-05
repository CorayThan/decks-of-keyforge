package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.nowLocal
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class OwnedDeck(

        val ownerId: UUID,

        @JsonIgnoreProperties("ownedDecks")
        @ManyToOne
        val deck: Deck,

        val teamId: UUID? = null,

        val added: LocalDateTime = nowLocal(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

interface OwnedDeckRepo : CrudRepository<OwnedDeck, Long> {
        fun existsByDeckIdAndOwnerId(deckId: Long, ownerId: UUID): Boolean
        fun deleteByDeckIdAndOwnerId(deckId: Long, ownerId: UUID)
}
