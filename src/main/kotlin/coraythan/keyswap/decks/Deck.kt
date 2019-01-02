package coraythan.keyswap.decks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.KeyforgeDeckLinks
import coraythan.keyswap.cards.Card
import coraythan.keyswap.userdeck.UserDeck
import javax.persistence.*

@Entity
data class Deck(

        @Column(unique = true)
        val keyforgeId: String,

        val name: String,
        val expansion: Int,
        val powerLevel: Int,
        val chains: Int,
        val wins: Int,
        val losses: Int,

        val maverickCount: Int = 0,
        val specialsCount: Int = 0,
        val raresCount: Int = 0,
        val uncommonsCount: Int = 0,

        val rawAmber: Int = 0,
        val totalPower: Int = 0,
        val totalCreatures: Int = 0,
        val totalArmor: Int = 0,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val sasRating: Double = 0.0,
        val cardsRating: Int = 0,
        val synergyRating: Double = 0.0,
        val antisynergyRating: Double = 0.0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val wishlistCount: Int = 0,
        val funnyCount: Int = 0,

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(
                name = "deck_cards",
                joinColumns = [JoinColumn(name = "deck_id", referencedColumnName = "id")],
                inverseJoinColumns = [JoinColumn(name = "card_id", referencedColumnName = "id")]
        )
        val cards: List<Card> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY)
        val userDecks: List<UserDeck> = listOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: List<House> = listOf(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class DecksPage(
        val decks: List<Deck>,
        val page: Int,
        val pages: Int
)

@JsonIgnoreProperties(ignoreUnknown = true)
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
