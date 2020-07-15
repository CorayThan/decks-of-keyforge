package coraythan.keyswap.synergy

import com.fasterxml.jackson.annotation.JsonIgnore
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

        @Transient
        @JsonIgnore
        val cardTypesInitial: List<CardType>? = listOf(),

        var cardTypesString: String = "",
        /**
         * Creature power expression, one of:
         *
         * ['odd','even','2-5','2 or less','3+','3,5,7']
         */
        var powersString: String = "",
        var cardTraitsString: String = "",
        val notCardTraits: Boolean = false,

        /**
         * Changes the starting base match strength. For example, starts at -50 for Grumpy Buggy. This means you need
         * 5 matches of 10% value to break even at 0% and start synergizing. This can be used to modify the starting point
         * for synergies and antisynergies away from the default 0, 50, and 100.
         */
        val baseSynPercent: Int = 0,

        @JsonIgnoreProperties("traits")
        @ManyToOne
        val traitInfo: ExtraCardInfo? = null,

        @JsonIgnoreProperties("synergies")
        @ManyToOne
        val synergyInfo: ExtraCardInfo? = null,

        val cardName: String? = null,

        val synergyGroup: String? = null,
        val synergyGroupMax: Int? = null,

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

    var cardTraits: List<String>
        get() {
            return cardTraitsString.split("-").filter { !it.isBlank() }
        }
        set(cardTraits) {
            cardTraitsString = cardTraits.joinToString("-")
        }

    init {
        if (!cardTypesInitial.isNullOrEmpty()) {
            this.cardTypes = cardTypesInitial
        }
    }

    fun powerMatch(power: Int, cardType: CardType? = CardType.Creature): Boolean {
        return when {
            powersString.isBlank() -> {
                true
            }
            cardType != CardType.Creature -> {
                false
            }
            powersString == "even" -> {
                power % 2 == 0
            }
            powersString == "odd" -> {
                power % 2 != 0
            }
            powersString.contains(" or less") -> {
                power <= powersString.replace(" or less", "").toInt()
            }
            powersString.contains("+") -> {
                power >= powersString.replace("+", "").toInt()
            }
            powersString.contains("-") -> {
                val nums = powersString.split("-")
                power >= nums[0].toInt() && power <= nums[1].toInt()
            }
            powersString.contains(",") -> {
                val nums = powersString.split(",")
                nums.any { power == it.toInt() }
            }
            powersString.toIntOrNull() != null -> {
                powersString.toInt() == power
            }
            else -> {
                throw IllegalStateException("Invalid power string: $powersString")
            }
        }
    }

    fun validate() {
        powerMatch(1)
    }

}

fun Collection<SynTraitValue>.containsTrait(trait: SynergyTrait, player: SynTraitPlayer? = null) = this.find {
    valueTrait -> valueTrait.trait == trait && (player == null || player == valueTrait.player)
} != null
