package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.users.KeyUser
import javax.persistence.*

@Entity
data class PreviouslyOwnedDeck(

        @ManyToOne
        val previousOwner: KeyUser,

        @JsonIgnoreProperties("previouslyOwnedDecks")
        @ManyToOne
        val deck: Deck,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)
