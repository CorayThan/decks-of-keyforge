package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExtraCardInfo(

        val cardNumber: Int,
        val rating: Int = 3,
        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,

        val traits: Set<SynTrait> = setOf(),

        val synergies: List<SynTraitValue> = listOf()
)
