package coraythan.keyswap.decks

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.KeyforgeDeckLinks
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.DeckSearchResultCard
import coraythan.keyswap.deckcard.DeckCard
import coraythan.keyswap.synergy.DeckSynergyInfo
import coraythan.keyswap.userdeck.UserDeck
import org.hibernate.annotations.Type
import javax.persistence.*

data class DeckWithSynergyInfo(
        val deck: DeckSearchResult,
        val deckSynergyInfo: DeckSynergyInfo,
        val cardRatingPercentile: Int,
        val synergyPercentile: Int,
        val antisynergyPercentile: Int,
        val sasPercentile: Int
)

@Entity
@Table(
        indexes = [
            Index(name = "sas_rating_idx", columnList = "sasRating", unique = false),
            Index(name = "cards_rating_idx", columnList = "cardsRating", unique = false),
            Index(name = "synergy_rating_idx", columnList = "synergyRating", unique = false),
            Index(name = "antisynergy_rating_idx", columnList = "antisynergyRating", unique = false),
            Index(name = "expected_amber_idx", columnList = "expectedAmber", unique = false),
            Index(name = "funny_count_idx", columnList = "funnyCount", unique = false),
            Index(name = "wishlist_count_idx", columnList = "wishlistCount", unique = false),
            Index(name = "for_sale_idx", columnList = "forSale", unique = false),
            Index(name = "for_trade_idx", columnList = "forTrade", unique = false),
            Index(name = "name_idx", columnList = "name", unique = false)

            // Manual index created on deck_houses
        ]
)
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
        val totalActions: Int = 0,
        val totalArtifacts: Int = 0,
        val totalUpgrades: Int = 0,
        val totalArmor: Int = 0,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val sasRating: Int = 0,
        val cardsRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val wishlistCount: Int = 0,
        val funnyCount: Int = 0,

        @JsonIgnoreProperties("deck")
        @OneToMany(fetch = FetchType.LAZY, mappedBy = "deck", cascade = [CascadeType.ALL])
        val cards: List<DeckCard> = listOf(),

        // Json of card ids for performance loading decks, loading cards from cache
        @Lob
        @Type(type = "org.hibernate.type.TextType")
        val cardIds: String = "",

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY)
        val userDecks: List<UserDeck> = listOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: List<House> = listOf(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
    @get:JsonIgnore
    val cardsList: List<Card>
        get() = cards.map { it.card }

    fun toDeckSearchResult(searchResultCards: List<DeckSearchResultCard>?) = DeckSearchResult(
            id = id,
            keyforgeId = keyforgeId,
            name = name,
            totalCreatures = totalCreatures,
            totalActions = totalActions,
            totalArtifacts = totalArtifacts,
            totalUpgrades = totalUpgrades,
            expectedAmber = expectedAmber,
            amberControl = amberControl,
            creatureControl = creatureControl,
            artifactControl = artifactControl,
            sasRating = sasRating,
            cardsRating = cardsRating,
            synergyRating = synergyRating,
            antisynergyRating = antisynergyRating,
            forSale = forSale,
            forTrade = forTrade,
            wishlistCount = wishlistCount,
            funnyCount = funnyCount,
            searchResultCards = searchResultCards ?: cards.map { it.card.toDeckSearchResultCard() },
            houses = houses
    )
}

// It takes a long time to load all the crap in hibernate, so avoid that.
data class DeckSearchResult(
        val id: Long,
        val keyforgeId: String,

        val name: String,

        val totalCreatures: Int = 0,
        val totalActions: Int = 0,
        val totalArtifacts: Int = 0,
        val totalUpgrades: Int = 0,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val sasRating: Int = 0,
        val cardsRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val wishlistCount: Int = 0,
        val funnyCount: Int = 0,

        val searchResultCards: List<DeckSearchResultCard> = listOf(),

        val houses: List<House> = listOf()
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class DecksPage(
        val decks: List<DeckSearchResult>,
        val page: Long
)

data class DeckCount(
        val pages: Long,
        val count: Long
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
