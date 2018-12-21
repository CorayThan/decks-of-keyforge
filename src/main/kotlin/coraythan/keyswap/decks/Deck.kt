package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.KeyforgeDeckLinks
import coraythan.keyswap.cards.Card
import javax.persistence.*

@Entity
data class Deck(
        @Id
        val id: String,
        val name: String,
        val expansion: Int,
        val powerLevel: Int,
        val chains: Int,
        val wins: Int,
        val losses: Int,

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(
                name = "deck_cards",
                joinColumns = [JoinColumn(name = "deck_id", referencedColumnName = "id")],
                inverseJoinColumns = [JoinColumn(name = "card_id", referencedColumnName = "id")]
        )
        val cards: List<Card> = listOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: Set<House> = setOf()
)

data class DecksPage(
        val decks: List<Deck>,
        val page: Int,
        val pages: Int
)

data class KeyforgeDeck(
        val id: String,
        val name: String,
        val expansion: Int,
        val power_level: Int,
        val chains: Int,
        val wins: Int,
        val losses: Int,
        val cards: List<String>? = null,
        val _links: KeyforgeDeckLinks? = null
) {
    fun toDeck() = Deck(id, name, expansion, power_level, chains, wins, losses)
}
