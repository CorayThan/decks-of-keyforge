package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
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

        /**
         * Only for unregistered decks
         */
        val creator: Boolean = false,

        val notes: String? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {

    fun toDto() = UserDeckDto(
            wishlist = wishlist,
            funny = funny,
            ownedBy = ownedBy,
            creator = creator,
            id = id,
            deckId = deck.id,
            notes = notes,

            username = user.username
    )
}

enum class DeckCondition {
    NEW_IN_PLASTIC,
    NEAR_MINT,
    PLAYED,
    HEAVILY_PLAYED
}

data class UserDeckDto(

        val wishlist: Boolean = false,
        val funny: Boolean = false,
        val ownedBy: String? = null,

        val creator: Boolean = false,

        val id: UUID = UUID.randomUUID(),

        val deckId: Long,

        val notes: String? = null,

        val username: String
)