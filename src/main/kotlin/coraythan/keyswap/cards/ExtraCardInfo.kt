package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.synergy.SynTrait
import coraythan.keyswap.synergy.SynTraitValue

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExtraCardInfo(

        val cardNumber: Int,
        val rating: Double = 3.0,
        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,

        val traits: Set<SynTrait> = setOf(),

        val synergies: List<SynTraitValue> = listOf()
)
