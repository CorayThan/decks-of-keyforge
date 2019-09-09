package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.auctions.Auction
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.DeckSearchResultCard
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.now
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.synergy.Synergies
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
        val efficiency: Double = 0.0,
        val effectivePower: Int = 0,
        val stealPrevention: Double? = 0.0,
        val disruption: Double? = 0.0,
        val houseCheating: Double? = 0.0,
        val other: Double? = 0.0,
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

        val cardNames: String = "",

        val houseNamesString: String = "",

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
        val userDecks: List<UserDeck> = listOf(),

        @JsonIgnoreProperties("deck")
        @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY)
        val auctions: List<Auction> = listOf(),

        /**
         * To redo the ratings:
        ALTER TABLE deck DROP COLUMN rating_version;
        ALTER TABLE deck ADD COLUMN rating_version int4;
        CREATE INDEX deck_ratings_version_idx ON deck (rating_version);
         */
        val ratingVersion: Int = 0,

        val listedOn: ZonedDateTime? = null,
        val auctionEnd: ZonedDateTime? = null,
        val auctionEndedOn: ZonedDateTime? = null,

        val importDateTime: ZonedDateTime? = now(),
        val lastUpdate: ZonedDateTime? = now(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {

    val houses: List<House>
        get() = this.houseNamesString.split("|").map { House.valueOf(it) }

    fun toDeckSearchResult(searchResultCards: List<DeckSearchResultCard>? = null, cards: List<Card>? = null, stats: DeckStatistics?): DeckSearchResult {
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
                    it.extraCardInfo?.traits?.contains(Synergies.drawsCards) == true
                            || it.extraCardInfo?.traits?.contains(Synergies.increasesHandSize) == true
                }?.size,
                cardArchiveCount = cards?.filter { it.extraCardInfo?.traits?.contains(Synergies.archives) == true }?.size,
                keyCheatCount = cards?.filter { it.extraCardInfo?.traits?.contains(Synergies.forgesKeys) == true }?.size,
                rawAmber = rawAmber,
                totalArmor = totalArmor,

                expectedAmber = expectedAmber,
                amberControl = amberControl,
                creatureControl = creatureControl,
                artifactControl = artifactControl,
                efficiency = efficiency,
                effectivePower = effectivePower,
                stealPrevention = stealPrevention ?: 0.0,
                disruption = disruption ?: 0.0,
                houseCheating = houseCheating ?: 0.0,
                other = other ?: 0.0,
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
                searchResultCards = searchResultCards ?: listOf(),
                houses = houses,

                sasPercentile = stats?.sasStats?.percentileForValue?.get(sasRating) ?: if (sasRating < 75) 0.0 else 100.0,
                amberControlPercentile = stats?.amberControlStats?.percentileForValue?.get(amberControl.toInt())?.toInt(),
                expectedAmberPercentile = stats?.expectedAmberStats?.percentileForValue?.get(expectedAmber.toInt())?.toInt(),
                stealPreventionPercentile = stats?.stealPreventionStats?.percentileForValue?.get(stealPrevention?.toInt())?.toInt(),
                artifactControlPercentile = stats?.artifactControlStats?.percentileForValue?.get(artifactControl.toInt())?.toInt(),
                creatureControlPercentile = stats?.creatureControlStats?.percentileForValue?.get(creatureControl.toInt())?.toInt(),
                effectivePowerPercentile = stats?.effectivePowerStats?.percentileForValue?.get(effectivePower.toInt())?.toInt(),
                efficiencyPercentile = stats?.efficiencyStats?.percentileForValue?.get(efficiency.toInt())?.toInt(),
                disruptionPercentile = stats?.disruptionStats?.percentileForValue?.get(disruption?.toInt())?.toInt(),
                houseCheatingPercentile = stats?.houseCheatingStats?.percentileForValue?.get(houseCheating?.toInt())?.toInt(),

                creaturesPercentile = stats?.creatureCountStats?.percentileForValue?.get(creatureCount)?.toInt(),
                actionsPercentile = stats?.actionCountStats?.percentileForValue?.get(actionCount)?.toInt(),
                artifactsPercentile = stats?.artifactCountStats?.percentileForValue?.get(artifactCount)?.toInt(),
                upgradesPercentile = stats?.upgradeCountStats?.percentileForValue?.get(upgradeCount)?.toInt()
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

    fun withCards(newCardsList: List<Card>): Deck {
        if (newCardsList.size != 36) throw IllegalArgumentException("The cards list contained too many cards: ${newCardsList.size}")

        val cardNames = "~" + newCardsList.groupBy { it.cardTitle }.map { entry ->
            "${entry.key}${(1..entry.value.size).joinToString("")}"
        }.joinToString("~") + "~" +
                newCardsList
                        .filter { it.maverick }
                        .groupBy { it.cardTitle }
                        .flatMap { entry ->
                            entry.value
                                    .groupBy { it.house }
                                    .map { houseToCards ->
                                        val firstCard = houseToCards.value[0]
                                        "${firstCard.cardTitle}${firstCard.house}"
                                    }
                        }.joinToString("~") + "~"

        return this.copy(
                cardNames = cardNames,
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
