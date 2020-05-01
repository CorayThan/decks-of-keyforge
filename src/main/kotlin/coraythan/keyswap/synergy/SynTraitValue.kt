package coraythan.keyswap.synergy

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import java.util.*
import javax.persistence.*

@Entity
data class SynTraitValue(
        @Enumerated(EnumType.STRING)
        val trait: SynergyTrait,
        val rating: Int = 3,
        @Enumerated(EnumType.STRING)
        val house: SynTraitHouse = SynTraitHouse.anyHouse,

        @Enumerated(EnumType.STRING)
        val player: SynTraitPlayer = SynTraitPlayer.ANY,

        var cardTypesString: String = "",

        @JsonIgnoreProperties("traits")
        @ManyToOne
        val traitInfo: ExtraCardInfo? = null,

        @JsonIgnoreProperties("synergies")
        @ManyToOne
        val synergyInfo: ExtraCardInfo? = null,

        val cardName: String? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) : Comparable<SynTraitValue> {
    override fun compareTo(other: SynTraitValue): Int {
        return other.rating - this.rating
    }

    fun strength() = when (rating) {
        1 -> TraitStrength.EXTRA_WEAK
        2 -> TraitStrength.WEAK
        3 -> TraitStrength.NORMAL
        4 -> TraitStrength.STRONG
        else -> TraitStrength.NORMAL
    }

    override fun toString(): String {
        return "SynTraitValue(trait=$trait, rating=$rating, type=$house, player=$player, cardTypes=$cardTypesString traitInfoId=${traitInfo?.id}, synergyInfoId=${synergyInfo?.id}, id=$id)"
    }

    var cardTypes: List<CardType>
        get() {
            return cardTypesString.split("-").mapNotNull { if (it.isBlank()) null else CardType.valueOf(it) }
        }
        set(cardTypes) {
            cardTypesString = cardTypes.joinToString("-")
        }

}

fun Collection<SynTraitValue>.containsTrait(trait: SynergyTrait) = this.find { valueTrait -> valueTrait.trait == trait } != null
