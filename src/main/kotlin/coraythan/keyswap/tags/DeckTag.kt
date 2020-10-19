package coraythan.keyswap.tags

import coraythan.keyswap.decks.models.Deck
import javax.persistence.*

@Entity
data class DeckTag(

        @ManyToOne
        val tag: KTag,

        @ManyToOne
        val deck: Deck,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)
