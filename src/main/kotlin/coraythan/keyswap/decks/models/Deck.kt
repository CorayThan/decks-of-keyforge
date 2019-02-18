package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.DeckSearchResultCard
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.userdeck.UserDeck
import org.hibernate.annotations.Type
import javax.persistence.*

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

        // Json of card ids for performance loading decks, loading cards from cache
        @Lob
        @Type(type = "org.hibernate.type.TextType")
        val cardIds: String = "",

        val cardNamesString: String? = null,

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

    fun toDeckSearchResult(searchResultCards: List<DeckSearchResultCard>): DeckSearchResult {
        // Load the houses
        this.houses.size
        return DeckSearchResult(
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
                searchResultCards = searchResultCards,
                houses = houses
        )
    }

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

fun Deck.withCards(newCardsList: List<Card>): Deck {
    if (newCardsList.size != 36) throw IllegalArgumentException("The cards list contained too many cards: ${newCardsList.size}")
    val cardNamesString = newCardsList.groupBy { it.cardTitle }.flatMap { entry ->
        (1..entry.value.size).map { "${entry.key}$it" }
    }.joinToString()
    return this.copy(
            cardNamesString = cardNamesString,
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

@JsonIgnoreProperties(ignoreUnknown = true)
data class DecksPage(
        val decks: List<DeckSearchResult>,
        val page: Long
)

data class DeckCount(
        val pages: Long,
        val count: Long
)
