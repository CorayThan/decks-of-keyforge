package coraythan.keyswap.decks

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.DeckSearchResultCard
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.deckcard.DeckCard
import coraythan.keyswap.synergy.DeckSynergyInfo
import coraythan.keyswap.thirdpartyservices.KeyforgeDeckLinks
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
        val powerLevel: Int = 0,
        val chains: Int = 0,
        val wins: Int = 0,
        val losses: Int = 0,

        val registered: Boolean = true,

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
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val userDecks: List<UserDeck> = listOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: List<House> = listOf(),

        val ratingVersion: Int = 0,

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

            powerLevel = powerLevel,
            chains = chains,
            wins = wins,
            losses = losses,

            registered = registered,

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
            totalPower = totalPower,
            forSale = forSale,
            forTrade = forTrade,
            wishlistCount = wishlistCount,
            funnyCount = funnyCount,
            searchResultCards = searchResultCards ?: cards.map { it.card.toDeckSearchResultCard() },
            houses = houses
    )

    fun addGameStats(keyforgeDeck: KeyforgeDeck): Deck? {
        if (this.wins == keyforgeDeck.wins && this.losses == keyforgeDeck.losses
                && this.chains == keyforgeDeck.chains && this.powerLevel == keyforgeDeck.power_level) {
            return null
        }
        return this.copy(
                wins = keyforgeDeck.wins,
                losses = keyforgeDeck.losses,
                chains = keyforgeDeck.chains,
                powerLevel = keyforgeDeck.power_level
        )
    }
}

fun Deck.withDeckCards(newCardsList: List<Card>): Deck {
    val deckCards = newCardsList.map { card ->
        DeckCard(this, card, card.cardTitle, cardsList.count { card.cardTitle == it.cardTitle })
    }
    return this.copy(
            cards = deckCards,
            rawAmber = newCardsList.map { it.amber }.sum(),
            totalPower = newCardsList.map { it.power }.sum(),
            totalArmor = newCardsList.map { it.armor }.sum(),
            totalCreatures = newCardsList.filter { it.cardType == CardType.Creature }.size,
            totalActions = newCardsList.filter { it.cardType == CardType.Action }.size,
            totalArtifacts = newCardsList.filter { it.cardType == CardType.Artifact }.size,
            totalUpgrades = newCardsList.filter { it.cardType == CardType.Upgrade }.size,
            maverickCount = newCardsList.filter { it.maverick }.size,
            specialsCount = newCardsList.filter { it.rarity == Rarity.FIXED || it.rarity == Rarity.Variant }.size,
            raresCount = newCardsList.filter { it.rarity == Rarity.Rare }.size,
            uncommonsCount = newCardsList.filter { it.rarity == Rarity.Uncommon }.size
    )
}

// It takes a long time to load all the crap in hibernate, so avoid that.
data class DeckSearchResult(
        val id: Long = -1,
        val keyforgeId: String = "",

        val name: String = "",

        val totalCreatures: Int = 0,
        val totalActions: Int = 0,
        val totalArtifacts: Int = 0,
        val totalUpgrades: Int = 0,

        val registered: Boolean = true,

        val powerLevel: Int = 0,
        val chains: Int = 0,
        val wins: Int = 0,
        val losses: Int = 0,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val sasRating: Int = 0,
        val cardsRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,

        val totalPower: Int = 0,

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
        val power_level: Int = 0,
        val chains: Int = 0,
        val wins: Int = 0,
        val losses: Int = 0,
        val cards: List<String>? = null,
        val _links: KeyforgeDeckLinks? = null
) {
    fun toDeck() = Deck(
            keyforgeId = id,
            name = name,
            expansion = expansion,
            powerLevel = power_level,
            chains = chains,
            wins = wins,
            losses = losses
    )
}
