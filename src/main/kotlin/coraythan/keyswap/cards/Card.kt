package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.decks.Wins
import coraythan.keyswap.decks.models.SimpleCard
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.now
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

}

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeCard(
        val id: String,
        val card_title: String,
        val house: String,
        val card_type: KeyForgeCardType,
        val front_image: String,
        val card_text: String,
        val amber: Int,
        val power: String?,
        val armor: String?,
        val rarity: Rarity,
        val flavor_text: String? = null,
        val card_number: String,
        val expansion: Int,
        val is_maverick: Boolean,
        val is_anomaly: Boolean,
        val is_enhanced: Boolean,
        val traits: String? = null
) {
    fun toCard(extraInfoMap: Map<String, ExtraCardInfo>): Card {
        val powerNumber = power?.toIntOrNull() ?: 0
        val armorNumber = armor?.toIntOrNull() ?: 0
        val expansionEnum = Expansion.forExpansionNumber(expansion)
        return Card(
                id, card_title, House.fromMasterVaultValue(house)!!, card_type.toCardType(), front_image, card_text, amber, powerNumber, power
                ?: "", armorNumber, armor ?: "", rarity, flavor_text,
                card_number, expansion, expansionEnum, is_maverick, is_anomaly,
                extraCardInfo = extraInfoMap[card_title.cleanCardName()],
                traits = traits?.toUpperCase()?.split(" • ")?.toSet() ?: setOf(),
                big = card_type == KeyForgeCardType.Creature1 || card_type == KeyForgeCardType.Creature2,
                enhanced = is_enhanced
        )
    }
}

enum class KeyForgeCardType {
    Action,
    Artifact,
    Creature,
    Creature1,
    Creature2,
    Upgrade;
}

enum class CardType {
    Action,
    Artifact,
    Creature,
    Upgrade;
}

fun KeyForgeCardType.toCardType() = when (this) {
    KeyForgeCardType.Action -> CardType.Action
    KeyForgeCardType.Artifact -> CardType.Artifact
    KeyForgeCardType.Creature -> CardType.Creature
    KeyForgeCardType.Creature1 -> CardType.Creature
    KeyForgeCardType.Creature2 -> CardType.Creature
    KeyForgeCardType.Upgrade -> CardType.Upgrade
}

@GenerateTs
enum class Rarity {
    Common,
    Uncommon,
    Rare,
    Variant,
    FIXED,
    Special;
}
