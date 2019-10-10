package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.Synergies
import javax.persistence.*

@JsonIgnoreProperties(ignoreUnknown = true)
data class ExtraCardInfoOld(

        val cardNumbers: List<CardNumberSetPair>,
        val rating: Double = 2.0,
        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double = 0.0,
        val efficiency: Double = 0.0,
        val effectivePower: Int? = null,
        val disruption: Double = 0.0,
        val amberProtection: Double = 0.0,
        val houseCheating: Double = 0.0,
        val other: Double = 0.0,

        val traits: Set<Synergies> = setOf(),

        val synergies: List<SynTraitValue> = listOf()
)

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
data class ExtraCardInfo(

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

        @OneToOne(mappedBy = "extraInfo")
        val card: Card? = null,

        @JsonIgnoreProperties("info")
        @OneToMany(mappedBy = "info", cascade = [CascadeType.ALL])
        val cardNumbers: List<CardIdentifier> = listOf(),

        @JsonIgnoreProperties("traitInfo")
        @OneToMany(mappedBy = "traitInfo", cascade = [CascadeType.ALL])
        val traits: List<SynTraitValue> = listOf(),

        @JsonIgnoreProperties("synergyInfo")
        @OneToMany(mappedBy = "synergyInfo", cascade = [CascadeType.ALL])
        val synergies: List<SynTraitValue> = listOf(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)
