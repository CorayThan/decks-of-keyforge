package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.auctions.Auction
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.DeckSearchResultCard
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.synergy.SynTrait
import coraythan.keyswap.userdeck.UserDeck
import org.hibernate.annotations.Type
import java.time.ZonedDateTime
import javax.persistence.*

@Entity
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
        val creatureCount: Int = 0,
        val actionCount: Int = 0,
        val artifactCount: Int = 0,
        val upgradeCount: Int = 0,
        val totalArmor: Int = 0,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val deckManipulation: Double? = 0.0,
        val effectivePower: Int? = 0,
        val aercScore: Double = 0.0,
        val previousSasRating: Int? = 0,
        val sasRating: Int = 0,
        val cardsRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,
        val completedAuction: Boolean = false,
        val wishlistCount: Int = 0,
        val funnyCount: Int = 0,

        // Json of card ids for performance loading decks, loading cards from cache
        @Lob
        @Type(type = "org.hibernate.type.TextType")
        val cardIds: String = "",

        val cardNamesString: String = "",

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val userDecks: List<UserDeck> = listOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: List<House> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY)
        val auctions: List<Auction> = listOf(),

        /**
         * To redo the ratings:
        ALTER TABLE deck DROP COLUMN rating_version;
        ALTER TABLE deck ADD COLUMN rating_version int4;
        CREATE INDEX deck_ratings_version_idx ON deck (rating_version);
         */
        val ratingVersion: Int? = 0,
        val statsVersion: Int? = 0,

        val listedOn: ZonedDateTime? = null,
        val auctionEnd: ZonedDateTime? = null,
        val auctionEndedOn: ZonedDateTime? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {

    fun toDeckSearchResult(searchResultCards: List<DeckSearchResultCard>, cards: List<Card>?): DeckSearchResult {
        // Load the houses
        this.houses.size
        return DeckSearchResult(
                id = id,
                keyforgeId = keyforgeId,
                expansion = expansion,
                name = name,

                powerLevel = powerLevel,
                chains = chains,
                wins = wins,
                losses = losses,

                registered = registered,

                creatureCount = creatureCount,
                actionCount = actionCount,
                artifactCount = artifactCount,
                upgradeCount = upgradeCount,

                cardDrawCount = cards?.filter {
                    it.extraCardInfo?.traits?.contains(SynTrait.drawsCards) == true
                            || it.extraCardInfo?.traits?.contains(SynTrait.increasesHandSize) == true
                }?.size,
                cardArchiveCount = cards?.filter { it.extraCardInfo?.traits?.contains(SynTrait.archives) == true }?.size,
                keyCheatCount = cards?.filter { it.extraCardInfo?.traits?.contains(SynTrait.forgesKeys) == true }?.size,
                rawAmber = rawAmber,
                totalArmor = totalArmor,

                expectedAmber = expectedAmber,
                amberControl = amberControl,
                creatureControl = creatureControl,
                artifactControl = artifactControl,
                deckManipulation = deckManipulation ?: 0.0,
                effectivePower = effectivePower ?: 0,
                aercScore = aercScore,
                previousSasRating = previousSasRating ?: sasRating,
                sasRating = sasRating,
                cardsRating = cardsRating,
                synergyRating = synergyRating,
                antisynergyRating = antisynergyRating,
                totalPower = totalPower,
                forSale = forSale,
                forTrade = forTrade,
                forAuction = forAuction,
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
            creatureCount = newCardsList.filter { it.cardType == CardType.Creature }.size,
            actionCount = newCardsList.filter { it.cardType == CardType.Action }.size,
            artifactCount = newCardsList.filter { it.cardType == CardType.Artifact }.size,
            upgradeCount = newCardsList.filter { it.cardType == CardType.Upgrade }.size,
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
