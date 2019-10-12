package coraythan.keyswap.synergy

import coraythan.keyswap.House

data class SynergyCombo(
        val house: House,
        val cardName: String,
        val synergies: Set<SynergyTrait>,
        val antisynergies: Set<SynergyTrait>,
        val netSynergy: Double,
        val synergy: Double,
        val antisynergy: Double,
        val cardRating: Double,

        val expectedAmber: Double,
        val amberControl: Double,
        val creatureControl: Double,
        val artifactControl: Double,
        val efficiency: Double,
        val effectivePower: Int,
        val amberProtection: Double,
        val disruption: Double,
        val houseCheating: Double,
        val other: Double,

        val copies: Int = 1
)

data class DeckSynergyInfo(
        val synergyRating: Double,
        val antisynergyRating: Double,
        val synergyCombos: List<SynergyCombo>
)
