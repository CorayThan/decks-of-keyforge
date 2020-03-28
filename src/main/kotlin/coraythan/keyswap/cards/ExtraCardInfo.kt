package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.now
import coraythan.keyswap.synergy.SynTraitValue
import java.time.LocalDate
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.OneToMany

data class CardNumberSetPairOld(
        val expansion: Int,
        val cardNumber: String
) {
    fun toNew() = CardNumberSetPair(Expansion.forExpansionNumber(expansion), this.padded().cardNumber)
    private fun padded() = this.copy(cardNumber = cardNumber.padStart(3, '0'))
}

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
data class ExtraCardInfo(

        var cardName: String = "",

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
        val cardNumbers: MutableList<CardIdentifier> = mutableListOf(),

        @JsonIgnoreProperties("traitInfo")
        @OneToMany(mappedBy = "traitInfo", cascade = [CascadeType.ALL])
        val traits: List<SynTraitValue> = listOf(),

        @JsonIgnoreProperties("synergyInfo")
        @OneToMany(mappedBy = "synergyInfo", cascade = [CascadeType.ALL])
        val synergies: List<SynTraitValue> = listOf(),

        val version: Int = 1,
        var active: Boolean = false,
        val created: ZonedDateTime? = now(),
        val updated: ZonedDateTime? = now(),
        var published: ZonedDateTime? = now(),
//
//        @OneToOne(mappedBy = "info")
//        val spoiler: Spoiler? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {

    val publishedDate: LocalDate?
        get() = published?.toLocalDate()

    fun readyForCreate(version: Int): ExtraCardInfo {
        now().toString()
        return this.copy(
                created = now(),
                updated = now(),
                version = version,
                active = false,
                synergies = mutableListOf(),
                traits = mutableListOf(),
                cardNumbers = mutableListOf(),
                id = UUID.randomUUID()
        )
    }

    fun nullMaxes() = this.copy(
            amberControlMax = if (this.amberControlMax == 0.0) null else this.amberControlMax,
            expectedAmberMax = if (this.expectedAmberMax == 0.0) null else this.expectedAmberMax,
            amberProtectionMax = if (this.amberProtectionMax == 0.0) null else this.amberProtectionMax,
            artifactControlMax = if (this.artifactControlMax == 0.0) null else this.artifactControlMax,
            creatureControlMax = if (this.creatureControlMax == 0.0) null else this.creatureControlMax,
            effectivePowerMax = if (this.effectivePowerMax == 0.0) null else this.effectivePowerMax,
            efficiencyMax = if (this.efficiencyMax == 0.0) null else this.efficiencyMax,
            disruptionMax = if (this.disruptionMax == 0.0) null else this.disruptionMax,
            houseCheatingMax = if (this.houseCheatingMax == 0.0) null else this.houseCheatingMax,
            otherMax = if (this.otherMax == 0.0) null else this.otherMax
    )

    fun replaceAercInfo(info: ExtraCardInfo): ExtraCardInfo {
        return this.copy(
                updated = now(),
                expectedAmber = info.expectedAmber,
                expectedAmberMax = info.expectedAmberMax,
                amberControl = info.amberControl,
                amberControlMax = info.amberControlMax,
                creatureControl = info.creatureControl,
                creatureControlMax = info.creatureControlMax,
                artifactControl = info.artifactControl,
                artifactControlMax = info.artifactControlMax,
                efficiency = info.efficiency,
                efficiencyMax = info.efficiencyMax,
                effectivePower = info.effectivePower,
                effectivePowerMax = info.effectivePowerMax,
                disruption = info.disruption,
                disruptionMax = info.disruptionMax,
                amberProtection = info.amberProtection,
                amberProtectionMax = info.amberProtectionMax,
                houseCheating = info.houseCheating,
                houseCheatingMax = info.houseCheatingMax,
                other = info.other,
                otherMax = info.otherMax,
                traits = mutableListOf(),
                synergies = mutableListOf()
        )
    }

}
