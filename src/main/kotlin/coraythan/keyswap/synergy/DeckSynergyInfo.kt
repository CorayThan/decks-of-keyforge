package coraythan.keyswap.synergy

import coraythan.keyswap.House
import java.math.BigDecimal

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
        val effectivePower: Int,
        val amberProtection: Double,
        val disruption: Double,
        val houseCheating: Double,
        val other: Double,

        val copies: Int = 1
) {
    fun toStrings() = SynergyComboStrings(
            house, cardName, synergies, netSynergy.roundToTens(), aercScore.roundToTens(),
            expectedAmber.roundToTens(), amberControl.roundToTens(), creatureControl.roundToTens(), artifactControl.roundToTens(), efficiency.roundToTens(),
            effectivePower, amberProtection.roundToTens(), disruption.roundToTens(), houseCheating.roundToTens(), other.roundToTens(), copies
    )
}

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

) {
    fun toStrings() = DeckSynergyInfoStrings(
            rawAerc, sasRating, synergyRating, antisynergyRating, synergyCombos.map { it.toStrings() }, expectedAmber.roundToTens(),
            amberControl.roundToTens(), creatureControl.roundToTens(), artifactControl.roundToTens(), efficiency.roundToTens(),
            effectivePower, amberProtection.roundToTens(), disruption.roundToTens(), houseCheating.roundToTens(), other.roundToTens()
    )
}

data class SynergyMatch(
        val trait: SynergyTrait,
        val percentSynergized: Int,
        val traitCards: Set<String>,
        val rating: Int,
        val type: SynTraitType
)


data class SynergyComboStrings(
        val house: House,
        val cardName: String,
        val synergies: List<SynergyMatch>,
        val netSynergy: BigDecimal,
        val aercScore: BigDecimal,

        val expectedAmber: BigDecimal,
        val amberControl: BigDecimal,
        val creatureControl: BigDecimal,
        val artifactControl: BigDecimal,
        val efficiency: BigDecimal,
        val effectivePower: Int,
        val amberProtection: BigDecimal,
        val disruption: BigDecimal,
        val houseCheating: BigDecimal,
        val other: BigDecimal,

        val copies: Int = 1
)

data class DeckSynergyInfoStrings(
        val rawAerc: Int,
        val sasRating: Int,
        val synergyRating: Int,
        val antisynergyRating: Int,
        val synergyCombos: List<SynergyComboStrings>,

        val expectedAmber: BigDecimal,
        val amberControl: BigDecimal,
        val creatureControl: BigDecimal,
        val artifactControl: BigDecimal,
        val efficiency: BigDecimal,
        val effectivePower: Int,
        val amberProtection: BigDecimal,
        val disruption: BigDecimal,
        val houseCheating: BigDecimal,
        val other: BigDecimal

)
