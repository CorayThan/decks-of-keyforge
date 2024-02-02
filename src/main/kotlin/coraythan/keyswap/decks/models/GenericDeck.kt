package coraythan.keyswap.decks.models

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.House
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.synergy.DeckSynergyInfo

interface GenericDeck {

    val name: String
    val expansion: Int

    // Json of card ids for performance loading decks, loading cards from cache
    val cardIds: String
    val tokenNumber: Int?

    val houseNamesString: String

    val bonusIconsString: String?

    val expansionEnum: Expansion
        get() = Expansion.forExpansionNumber(expansion)

    val houses: List<House>
        get() = this.houseNamesString.split("|").map { House.valueOf(it) }

    fun bonusIcons(): DeckBonusIcons {
        val toParse = this.bonusIconsString?.trim()
        if (toParse.isNullOrEmpty()) {
            return DeckBonusIcons()
        }
        return jacksonObjectMapper().readValue<DeckBonusIcons>(toParse)
    }

    fun toDeckSearchResult(
        housesAndCards: List<HouseAndCards>? = null,
        cards: List<DokCardInDeck>? = null,
        stats: DeckStatistics? = null,
        synergies: DeckSynergyInfo? = null,
        includeDetails: Boolean = false,
        token: DokCardInDeck? = null,
    ): DeckSearchResult
}

@GenerateTs
enum class DeckType {
    STANDARD,
    ALLIANCE
}
