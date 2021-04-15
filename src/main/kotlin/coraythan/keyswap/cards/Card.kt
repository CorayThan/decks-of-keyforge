package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
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
        if (expansion == Expansion.CALL_OF_THE_ARCHONS.expansionNumber && other.expansion == Expansion.CALL_OF_THE_ARCHONS.expansionNumber) {
            return (cardNumber.toIntOrNull() ?: 0) - (other.cardNumber.toIntOrNull() ?: 0)
        }
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
                    printValue("P", this.effectivePower.toDouble() / 10, if (info.effectivePowerMax != null && info.effectivePowerMax != 0.0) info.effectivePowerMax / 10 else null),
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

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeCard(
        val id: String,
        val card_title: String,
        val house: String,
        val card_type: String,
        val front_image: String,
        val card_text: String,
        val amber: Int,
        val power: String?,
        val armor: String?,
        val rarity: String,
        val flavor_text: String? = null,
        val card_number: String,
        val expansion: Int,
        val is_maverick: Boolean,
        val is_anomaly: Boolean,
        val is_enhanced: Boolean,
        val traits: String? = null
) {
    fun toCard(extraInfoMap: Map<String, ExtraCardInfo>): Card? {
        val powerNumber = power?.toIntOrNull() ?: 0
        val armorNumber = armor?.toIntOrNull() ?: 0
        val expansionEnum = Expansion.forExpansionNumber(expansion)
        val realCardType = theirCardTypeToReasonableOne(card_type) ?: return null
        val realRarity = theirRarityToReasonableOne(rarity) ?: return null
        val cardTitleFixed = if (realRarity == Rarity.EvilTwin) {
            "$card_title – Evil Twin"
        } else {
            card_title
        }
        return Card(
                id, cardTitleFixed, House.fromMasterVaultValue(house)!!, realCardType, front_image, card_text, amber, powerNumber, power
                ?: "", armorNumber, armor ?: "", realRarity, flavor_text,
                card_number, expansion, expansionEnum, is_maverick, is_anomaly,
                extraCardInfo = extraInfoMap[cardTitleFixed.cleanCardName()],
                traits = traits?.toUpperCase()?.split(" • ")?.toSet() ?: setOf(),
                big = card_type == "Creature1" || card_type == "Creature2",
                enhanced = is_enhanced
        )
    }

    private fun theirCardTypeToReasonableOne(dumbCardType: String): CardType? {
        return when (dumbCardType) {
            "Action" -> CardType.Action
            "Artifact" -> CardType.Artifact
            "Creature" -> CardType.Creature
            "Creature1" -> CardType.Creature
            "Creature2" -> CardType.Creature
            "Upgrade" -> CardType.Upgrade
            "The Tide" -> null
            else -> throw IllegalStateException("Weird card type $dumbCardType")
        }
    }

    private fun theirRarityToReasonableOne(dumbRarity: String): Rarity? {
        return when (dumbRarity) {
            "Common" -> Rarity.Common
            "Uncommon" -> Rarity.Uncommon
            "Rare" -> Rarity.Rare
            "Variant" -> Rarity.Variant
            "FIXED" -> Rarity.FIXED
            "Special" -> Rarity.Special
            "Evil Twin" -> Rarity.EvilTwin
            "The Tide" -> null
            else -> throw IllegalStateException("Weird rarity $dumbRarity")
        }
    }
}

enum class CardType {
    Action,
    Artifact,
    Creature,
    Upgrade;
}

@GenerateTs
enum class Rarity {
    Common,
    Uncommon,
    Rare,
    Variant,
    FIXED,
    Special,
    EvilTwin;
}
