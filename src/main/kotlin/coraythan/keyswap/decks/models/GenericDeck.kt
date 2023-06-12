package coraythan.keyswap.decks.models

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.synergy.DeckSynergyInfo

interface GenericDeck {

    val name: String
    val expansion: Int

    val rawAmber: Int
    val totalPower: Int
    val bonusDraw: Int?
    val bonusCapture: Int?
    val creatureCount: Int
    val actionCount: Int
    val artifactCount: Int
    val upgradeCount: Int
    val totalArmor: Int

    val expectedAmber: Double
    val amberControl: Double
    val creatureControl: Double
    val artifactControl: Double
    val efficiency: Double
    val recursion: Double?
    val effectivePower: Int
    val creatureProtection: Double?
    val disruption: Double
    val other: Double
    val aercScore: Double
    val previousSasRating: Int?
    val previousMajorSasRating: Int?
    val aercVersion: Int?
    val sasRating: Int
    val synergyRating: Int
    val antisynergyRating: Int

    // Json of card ids for performance loading decks, loading cards from cache
    val cardIds: String
    val tokenId: String?

    val cardNames: String

    val houseNamesString: String

    val bonusIconsString: String?

    val expansionEnum: Expansion
        get() = Expansion.forExpansionNumber(expansion)

    val houses: List<House>
        get() = this.houseNamesString.split("|").map { House.valueOf(it) }

    fun bonusIcons(): DeckBonusIcons? {
        val toParse = this.bonusIconsString?.trim()
        if (toParse.isNullOrEmpty()) {
            return null
        }
        return jacksonObjectMapper().readValue<DeckBonusIcons>(toParse)
    }

    fun toDeckSearchResult(
        housesAndCards: List<HouseAndCards>? = null,
        cards: List<Card>? = null,
        stats: DeckStatistics? = null,
        synergies: DeckSynergyInfo? = null,
        includeDetails: Boolean = false,
        token: Card? = null,
    ): DeckSearchResult
}

@GenerateTs
enum class DeckType {
    STANDARD,
    ALLIANCE
}
