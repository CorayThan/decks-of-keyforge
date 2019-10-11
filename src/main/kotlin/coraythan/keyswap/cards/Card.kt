package coraythan.keyswap.cards

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
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

        val wins: Int? = 0,
        val losses: Int? = 0,

        @ElementCollection
        val traits: Set<String> = setOf(),

        @Transient
        var extraCardInfo: ExtraCardInfo?
) : Comparable<Card> {

    override fun compareTo(other: Card): Int {
        if (expansion == Expansion.CALL_OF_THE_ARCHONS.expansionNumber && other.expansion == Expansion.CALL_OF_THE_ARCHONS.expansionNumber) {
            return (cardNumber.toIntOrNull() ?: 0) - (other.cardNumber.toIntOrNull() ?: 0)
        }
        if (house != other.house) return house.compareTo(other.house)
        if (cardType != other.cardType) return cardType.compareTo(other.cardType)
        return cardTitle.compareTo(other.cardTitle)
    }

    val effectivePower: Int
        get() = extraCardInfo?.effectivePower ?: power + armor

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
                        cardInfo.houseCheating +
                        cardInfo.amberProtection +
                        cardInfo.other +
                        this.effectivePower.toDouble() / 10 +
                        (if (this.cardType == CardType.Creature) 0.4 else 0.0)
            }
        }

    fun toDeckSearchResultCard() = DeckSearchResultCard(
            cardTitle = cardTitle,
            house = house,
            rarity = rarity,
            maverick = maverick
    )
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeCard(
        val id: String,
        val card_title: String,
        val house: House,
        val card_type: CardType,
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
        val traits: String? = null
) {
    fun toCard(extraInfoMap: Map<CardNumberSetPair, ExtraCardInfo>): Card {
        val powerNumber = power?.toIntOrNull() ?: 0
        val armorNumber = armor?.toIntOrNull() ?: 0
        val expansionEnum = Expansion.forExpansionNumber(expansion)
        return Card(id, card_title, house, card_type, front_image, card_text, amber, powerNumber, power ?: "", armorNumber, armor ?: "", rarity, flavor_text,
                card_number, expansion, expansionEnum, is_maverick,
                extraCardInfo = extraInfoMap[CardNumberSetPair(expansionEnum, card_number)],
                traits = traits?.split(" • ")?.toSet() ?: setOf())
    }
}

data class DeckSearchResultCard(
        val cardTitle: String,
        val house: House,
        val rarity: Rarity,
        val maverick: Boolean
)

enum class CardType {
    Action,
    Artifact,
    Creature,
    Upgrade;
}

enum class Rarity {
    Common,
    Uncommon,
    Rare,
    Variant,
    FIXED;
}
