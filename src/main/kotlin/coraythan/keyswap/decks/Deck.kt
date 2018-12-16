package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import javax.persistence.*

@Entity
data class Deck(
        @Id
        val id: String,
        val name: String,
        val expansion: Int,
        val power_level: Int,
        val chains: Int,
        val wins: Int,
        val losses: Int,

        @ManyToMany
        val cardInstances: List<Card> = listOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: Set<House> = setOf(),

        @Transient
        val cards: List<String>? = null,

        @Transient
        val _links: KeyforgeDeckLinks? = null
)
