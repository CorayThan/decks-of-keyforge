package coraythan.keyswap.decks.models

import coraythan.keyswap.House
import coraythan.keyswap.cards.DeckSearchResultCard

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
        val aercScore: Double = 0.0,
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

        val houses: List<House> = listOf(),

        val deckSaleInfo: List<DeckSaleInfo>? = null
)