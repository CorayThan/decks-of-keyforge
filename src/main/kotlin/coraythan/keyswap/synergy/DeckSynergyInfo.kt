package coraythan.keyswap.synergy

import coraythan.keyswap.House

data class SynergyCombo(
        val house: House,
        val cardName: String,
        val synergies: List<SynergyMatch>,
        val netSynergy: Double,
        val synergy: Double,
        val antisynergy: Double,
        val aercScore: Double,

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
        val rawAerc: Int,
        val sasRating: Int,
        val synergyRating: Int,
        val antisynergyRating: Int,
        val synergyCombos: List<SynergyCombo>,

        val expectedAmber: Double,
        val amberControl: Double,
        val creatureControl: Double,
        val artifactControl: Double,
        val efficiency: Double,
        val effectivePower: Int,
        val amberProtection: Double,
        val disruption: Double,
        val houseCheating: Double,
        val other: Double

)

data class SynergyMatch(
        val trait: SynergyTrait,
        val percentSynergized: Int,
        val traitCards: Set<String>
)
