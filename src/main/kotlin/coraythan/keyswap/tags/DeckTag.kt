package coraythan.keyswap.tags

import coraythan.keyswap.decks.models.Deck
import jakarta.persistence.*

@Entity
data class DeckTag(

        @ManyToOne
        val tag: KTag,

        @ManyToOne
        val deck: Deck,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1
)
