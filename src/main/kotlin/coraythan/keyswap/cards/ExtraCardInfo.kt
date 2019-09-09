package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.Synergies

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExtraCardInfo(

        val cardNumbers: List<CardNumberSetPair>,
        val rating: Double = 2.0,
        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val efficiency: Double = 0.0,
        val effectivePower: Int? = null,
        val disruption: Double = 0.0,
        val stealPrevention: Double = 0.0,
        val houseCheating: Double = 0.0,
        val other: Double = 0.0,

        val traits: Set<Synergies> = setOf(),

        val synergies: List<SynTraitValue> = listOf()
)
