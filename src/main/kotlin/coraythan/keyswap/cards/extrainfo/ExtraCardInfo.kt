package coraythan.keyswap.cards.extrainfo

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.vladmihalcea.hibernate.type.array.ListArrayType
import coraythan.keyswap.cards.CardNumberSetPair
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.now
import coraythan.keyswap.synergy.SynTraitValue
import org.hibernate.annotations.Parameter
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import java.time.LocalDate
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

data class CardNumberSetPairOld(
        val expansion: Int,
        val cardNumber: String,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        val enhanced: Boolean? = null
) {
    fun toNew() = CardNumberSetPair(Expansion.forExpansionNumber(expansion), this.padded().cardNumber)
    private fun padded() = this.copy(cardNumber = cardNumber.padStart(3, '0'))
}

@GenerateTs
@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@TypeDef(
        name = "list-array",
        typeClass = ListArrayType::class
)
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

        val recursion: Double = 0.0,
        val recursionMax: Double? = null,

        val effectivePower: Int = 0,
        val effectivePowerMax: Double? = null,

        val disruption: Double = 0.0,
        val disruptionMax: Double? = null,

        val creatureProtection: Double = 0.0,
        val creatureProtectionMax: Double? = null,

        val other: Double = 0.0,
        val otherMax: Double? = null,

        val adaptiveScore: Int = 0,

        val enhancementAmber: Int = 0,
        val enhancementCapture: Int = 0,
        val enhancementDraw: Int = 0,
        val enhancementDamage: Int = 0,

        /**
         * Changes the starting base match strength. For example, starts at -50 for Grumpy Buggy. This means you need
         * 5 matches of 10% value to break even at 0% and start synergizing. This can be used to modify the starting point
         * for synergies and antisynergies away from the default 0, 50, and 100.
         */
        val baseSynPercent: Int? = null,

        @Type(
                type = "com.vladmihalcea.hibernate.type.array.ListArrayType",
                parameters = [Parameter(value = "CARD_TYPE", name = ListArrayType.SQL_ARRAY_TYPE)]
        )
        @Column(columnDefinition = "CARD_TYPE[]")
        val extraCardTypes: List<CardType>? = null,

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
        var published: ZonedDateTime? = null,

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
                id = UUID.randomUUID(),
                published = null,
        )
    }

    fun nullMaxes() = this.copy(
            amberControlMax = if (this.amberControlMax == 0.0) null else this.amberControlMax,
            expectedAmberMax = if (this.expectedAmberMax == 0.0) null else this.expectedAmberMax,
            creatureProtectionMax = if (this.creatureProtectionMax == 0.0) null else this.creatureProtectionMax,
            artifactControlMax = if (this.artifactControlMax == 0.0) null else this.artifactControlMax,
            creatureControlMax = if (this.creatureControlMax == 0.0) null else this.creatureControlMax,
            effectivePowerMax = if (this.effectivePowerMax == 0.0) null else this.effectivePowerMax,
            efficiencyMax = if (this.efficiencyMax == 0.0) null else this.efficiencyMax,
            recursionMax = if (this.recursionMax == 0.0) null else this.recursionMax,
            disruptionMax = if (this.disruptionMax == 0.0) null else this.disruptionMax,
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
                recursion = info.recursion,
                recursionMax = info.recursionMax,
                effectivePower = info.effectivePower,
                effectivePowerMax = info.effectivePowerMax,
                disruption = info.disruption,
                disruptionMax = info.disruptionMax,
                creatureProtection = info.creatureProtection,
                creatureProtectionMax = info.creatureProtectionMax,
                other = info.other,
                otherMax = info.otherMax,
                enhancementAmber = info.enhancementAmber,
                enhancementCapture = info.enhancementCapture,
                enhancementDamage = info.enhancementDamage,
                enhancementDraw = info.enhancementDraw,
                baseSynPercent = info.baseSynPercent,
                adaptiveScore = info.adaptiveScore,
                traits = mutableListOf(),
                synergies = mutableListOf()
        )
    }

    fun enhancementCount(): Int {
        return enhancementAmber + enhancementCapture + enhancementDamage + enhancementDraw
    }

}
