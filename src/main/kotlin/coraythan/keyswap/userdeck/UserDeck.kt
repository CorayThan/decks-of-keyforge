package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.users.KeyUser
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class UserDeck(

        @JsonIgnoreProperties("decks")
        @ManyToOne
        val user: KeyUser,

        @ManyToOne
        val deck: Deck,

        val wishlist: Boolean = false,
        val funny: Boolean = false,
        val ownedBy: String? = null,

        val teamId: UUID? = null,

        val notes: String? = null,

        val migrated: Boolean? = true,

        @Id
        val id: UUID = UUID.randomUUID()
)

@GenerateTs
enum class DeckCondition {
    NEW_IN_PLASTIC,
    NEAR_MINT,
    PLAYED,
    HEAVILY_PLAYED
}

@GenerateTs
data class DeckNotesDto(
        val deckId: Long,
        val notes: String,
)
