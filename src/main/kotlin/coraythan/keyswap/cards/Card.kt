package coraythan.keyswap.cards

import coraythan.keyswap.House
import coraythan.keyswap.decks.Wins
import coraythan.keyswap.decks.models.SimpleCard
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.now
import coraythan.keyswap.roundToTwoSigDig
import coraythan.keyswap.synergy.SynTraitValue
import java.time.ZonedDateTime
import javax.persistence.*

@Entity
data class Card(
    @Id
    val id: String,
    val cardTitle: String,
    @Enumerated(EnumType.STRING)
    val house: House,
    @Enumerated(EnumType.STRING)
    val cardType: CardType,
    val frontImage: String,
    val cardText: String,
    val amber: Int,
    val power: Int,
    val powerString: String,
    val armor: Int,
    val armorString: String,
    @Enumerated(EnumType.STRING)
    val rarity: Rarity,
    val flavorText: String? = null,
    val cardNumber: String,
    val expansion: Int,
    @Enumerated(EnumType.STRING)
    val expansionEnum: Expansion,
    val maverick: Boolean,
    val anomaly: Boolean,
    val enhanced: Boolean? = null,
    val big: Boolean? = null,
    val token: Boolean = false,

    val wins: Int? = 0,
    val losses: Int? = 0,

    val created: ZonedDateTime = now(),

    @ElementCollection
    val traits: Set<String> = setOf(),

    @Transient
    var extraCardInfo: ExtraCardInfo?,

    @Transient
    var cardNumbers: List<CardNumberSetPair>? = null,

    @Transient
    var houses: List<House>? = null,

    @Transient
    var expansionWins: Map<Expansion, Wins>? = null
) : Comparable<Card> {

    override fun compareTo(other: Card): Int {
        if (house != other.house) return house.compareTo(other.house)
        if (cardType != other.cardType) return cardType.compareTo(other.cardType)
        return cardTitle.compareTo(other.cardTitle)
    }

    fun allTypes() = extraCardInfo?.extraCardTypes?.toSet()?.plus(cardType) ?: setOf(cardType)

    val effectivePower: Int
        get() = if (extraCardInfo?.effectivePower != 0) {
            extraCardInfo?.effectivePower ?: 0
        } else {
            power + armor
        }

    val aercScoreAverage: Double
        get() {
            val max = aercScoreMax
            return if (max == null) aercScore else (aercScore + max) / 2
        }

    val aercScore: Double
        get() {
            val cardInfo = this.extraCardInfo
            return if (cardInfo == null) {
                0.0
            } else {
                cardInfo.amberControl +
                        cardInfo.expectedAmber +
                        cardInfo.artifactControl +
                        cardInfo.creatureControl +
                        cardInfo.efficiency +
                        cardInfo.recursion +
                        cardInfo.disruption +
                        cardInfo.creatureProtection +
                        cardInfo.other +
                        this.effectivePower.toDouble() / 10 +
                        (if (this.cardType == CardType.Creature) 0.4 else 0.0)
            }
        }

    val aercScoreMax: Double?
        get() {
            val cardInfo = this.extraCardInfo
            return if (cardInfo == null) {
                null
            } else {
                val maxAerc = (cardInfo.amberControlMax ?: cardInfo.amberControl) +
                        (cardInfo.artifactControlMax ?: cardInfo.artifactControl) +
                        (cardInfo.creatureControlMax ?: cardInfo.creatureControl) +
                        (cardInfo.efficiencyMax ?: cardInfo.efficiency) +
                        (cardInfo.recursionMax ?: cardInfo.recursion) +
                        (cardInfo.disruptionMax ?: cardInfo.disruption) +
                        (cardInfo.creatureProtectionMax ?: cardInfo.creatureProtection) +
                        (cardInfo.otherMax ?: cardInfo.other) +
                        (cardInfo.expectedAmberMax ?: cardInfo.expectedAmber) +
                        (if (cardInfo.effectivePowerMax == null) {
                            this.effectivePower.toDouble() / 10
                        } else {
                            cardInfo.effectivePowerMax / 10
                        }) +
                        (if (this.cardType == CardType.Creature) 0.4 else 0.0)

                if (maxAerc == this.aercScore) {
                    null
                } else {
                    maxAerc
                }
            }
        }

    fun toSimpleCard(isLegacy: Boolean) = SimpleCard(
        cardTitle = cardTitle,
        rarity = rarity,
        maverick = maverick,
        anomaly = anomaly,
        enhanced = enhanced,
        legacy = isLegacy
    )

    fun printValues(): String {
        val info = extraCardInfo
        return if (info == null) {
            "unknown"
        } else {
            listOfNotNull(
                printValue("AERC", aercScore, aercScoreMax),
                printValue("A", info.amberControl, info.amberControlMax),
                printValue("E", info.expectedAmber, info.expectedAmberMax),
                printValue("R", info.artifactControl, info.artifactControlMax),
                printValue("C", info.creatureControl, info.creatureControlMax),
                printValue(
                    "P",
                    this.effectivePower.toDouble() / 10,
                    if (info.effectivePowerMax != null && info.effectivePowerMax != 0.0) info.effectivePowerMax / 10 else null
                ),
                printValue("F", info.efficiency, info.efficiencyMax),
                printValue("U", info.recursion, info.recursionMax),
                printValue("D", info.disruption, info.disruptionMax),
                printValue("CP", info.creatureProtection, info.creatureProtectionMax),
                printValue("O", info.other, info.otherMax)
            )
                .joinToString(" • ") +
                    printTraits("Traits", info.traits) +
                    printTraits("Syns", info.synergies)

        }
    }

    fun isEvilTwin() = this.cardTitle.contains(evilTwinCardName)

    private fun printValue(name: String, min: Double, max: Double?) = if (min == 0.0 && (max == 0.0 || max == null)) {
        null
    } else {
        "$name: ${min.roundToTwoSigDig()}${if (max == null || max == 0.0) "" else " to ${max.roundToTwoSigDig()}"}"
    }

    private fun printTraits(name: String, traits: List<SynTraitValue>) = if (traits.isEmpty()) {
        ""
    } else {
        "\n$name: ${traits.joinToString(" • ") { it.print() }}"
    }


}

const val evilTwinCardName = " – Evil Twin"

@GenerateTs
enum class CardType {
    Action,
    Artifact,
    Creature,
    Upgrade,
    TokenCreature;
}

@GenerateTs
enum class Rarity {
    Common,
    Uncommon,
    Rare,
    Variant,
    FIXED,
    Special,
    EvilTwin,
    Token;
}
