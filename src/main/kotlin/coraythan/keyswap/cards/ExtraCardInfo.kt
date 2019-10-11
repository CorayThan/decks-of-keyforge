package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.now
import coraythan.keyswap.synergy.SynTraitValue
import java.time.ZonedDateTime
import javax.persistence.*

data class CardNumberSetPairOld(
        val expansion: Int,
        val cardNumber: String
) {
        fun padded() = this.copy(cardNumber = cardNumber.padStart(3, '0'))
        fun toNew() = CardNumberSetPair(Expansion.forExpansionNumber(expansion), this.padded().cardNumber)
}

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
data class ExtraCardInfo(

        // TODO delete me
        val rating: Double = 2.0,

        val expectedAmber: Double = 0.0,
        val expectedAmberMax: Double? = null,

        val amberControl: Double = 0.0,
        val amberControlMax: Double? = null,

        val creatureControl: Double = 0.0,
        val creatureControlMax: Double? = null,

        val artifactControl: Double = 0.0,
        val artifactControlMax: Double? = null,

        val efficiency: Double = 0.0,
        val efficiencyMax: Double? = null,

        val effectivePower: Int = 0,
        val effectivePowerMax: Double? = null,

        val disruption: Double = 0.0,
        val disruptionMax: Double? = null,

        val amberProtection: Double = 0.0,
        val amberProtectionMax: Double? = null,

        val houseCheating: Double = 0.0,
        val houseCheatingMax: Double? = null,

        val other: Double = 0.0,
        val otherMax: Double? = null,

        @JsonIgnoreProperties("info")
        @OneToMany(mappedBy = "info", cascade = [CascadeType.ALL])
        val cardNumbers: List<CardIdentifier> = listOf(),

        @JsonIgnoreProperties("traitInfo")
        @OneToMany(mappedBy = "traitInfo", cascade = [CascadeType.ALL])
        val traits: List<SynTraitValue> = listOf(),

        @JsonIgnoreProperties("synergyInfo")
        @OneToMany(mappedBy = "synergyInfo", cascade = [CascadeType.ALL])
        val synergies: List<SynTraitValue> = listOf(),

        val version: Int,
        val active: Boolean,
        val created: ZonedDateTime? = now(),
        val updated: ZonedDateTime? = now(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)
