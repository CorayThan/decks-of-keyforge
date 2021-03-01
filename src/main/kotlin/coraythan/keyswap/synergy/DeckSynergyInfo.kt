package coraythan.keyswap.synergy

import coraythan.keyswap.House

data class SynergyCombo(
        val house: House,
        val cardName: String,
        val synergies: List<SynergyMatch>,
        val netSynergy: Double,
        val aercScore: Double,

        val expectedAmber: Double,
        val amberControl: Double,
        val creatureControl: Double,
        val artifactControl: Double,
        val efficiency: Double,
        val recursion: Double,
        val effectivePower: Int,
        val creatureProtection: Double,
        val disruption: Double,
        val other: Double,

        val copies: Int = 1,

        val notCard: Boolean? = null,
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
        val recursion: Double,
        val effectivePower: Int,
        val creatureProtection: Double,
        val disruption: Double,
        val other: Double,

        val metaScores: Map<String, Int>,
        val efficienyBonus: Double,
) {
    fun meta() = metaScores.map { it.value }.sum()
}

data class SynergyMatch(
        val trait: SynTraitValue,
        val percentSynergized: Int,
        val traitCards: Set<String>
)
