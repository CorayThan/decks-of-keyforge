package coraythan.keyswap.synergy

import coraythan.keyswap.House

data class SynergyCombo(
        val house: House,
        val cardName: String,
        val synergies: Set<SynTrait>,
        val antisynergies: Set<SynTrait>,
        val netSynergy: Double,
        val synergy: Double,
        val antisynergy: Double,
        val cardRating: Int,
        val copies: Int = 1
)

data class DeckSynergyInfo(
        val synergyRating: Double,
        val antisynergyRating: Double,
        val synergyCombos: List<SynergyCombo>
)
