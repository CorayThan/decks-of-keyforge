package coraythan.keyswap.decks.models

import coraythan.keyswap.House
import coraythan.keyswap.cards.DeckSearchResultCard
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.synergy.DeckSynergyInfo

// It takes a long time to load all the crap in hibernate, so avoid that.
data class DeckSearchResult(
        val id: Long = -1,
        val keyforgeId: String = "",
        val expansion: Expansion,

        val name: String = "",

        val creatureCount: Int = 0,
        val actionCount: Int = 0,
        val artifactCount: Int = 0,
        val upgradeCount: Int = 0,

        val registered: Boolean = true,

        val powerLevel: Int = 0,
        val chains: Int = 0,
        val wins: Int = 0,
        val losses: Int = 0,
        val crucibleTrackerWins: Int? = null,
        val crucibleTrackerLosses: Int? = null,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val efficiency: Double = 0.0,
        val effectivePower: Int = 0,
        val amberProtection: Double = 0.0,
        val disruption: Double = 0.0,
        val houseCheating: Double = 0.0,
        val other: Double = 0.0,
        val aercScore: Double = 0.0,
        val previousSasRating: Int = 0,
        val sasV3: Int? = null,
        val sasRating: Int = 0,
        val cardsRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,

        val totalPower: Int = 0,
        val cardDrawCount: Int? = null,
        val cardArchiveCount: Int? = null,
        val keyCheatCount: Int? = null,
        val rawAmber: Int = 0,
        val totalArmor: Int = 0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,
        val wishlistCount: Int = 0,
        val funnyCount: Int = 0,

        val sasPercentile: Double = 0.0,

        val searchResultCards: List<DeckSearchResultCard> = listOf(),

        val houses: List<House> = listOf(),

        val deckSaleInfo: List<DeckSaleInfo>? = null,

        val owners: List<String>? = null,

        val synergies: DeckSynergyInfo? = null
)
