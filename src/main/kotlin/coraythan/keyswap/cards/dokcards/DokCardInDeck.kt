package coraythan.keyswap.cards.dokcards

import coraythan.keyswap.House
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.decks.models.GenericDeck
import coraythan.keyswap.decks.models.SimpleCard
import coraythan.keyswap.decks.models.TokenInfo
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class DokCardInDeck(

    val card: DokCard,
    val extraCardInfo: ExtraCardInfo,
    val house: House,
    val rarity: Rarity,
    val maverick: Boolean = false,
    val anomaly: Boolean = false,
    val legacy: Boolean = false,
    val bonusAember: Int = 0,
    val bonusCapture: Int = 0,
    val bonusDamage: Int = 0,
    val bonusDraw: Int = 0,
    val bonusDiscard: Int = 0,
) : Comparable<DokCardInDeck> {
    constructor(deck: GenericDeck, card: ExtraCardInfo, cardHouse: House, cardExpansion: Expansion) : this(
        card = card.dokCard,
        extraCardInfo = card,
        house = cardHouse,
        rarity = card.dokCard.expansions.firstOrNull { it.expansion == cardExpansion }?.rarity ?: Rarity.Common,
        anomaly = cardExpansion === Expansion.ANOMALY_EXPANSION,
        maverick = card.dokCard.houses.isNotEmpty() && !card.dokCard.houses.contains(
            cardHouse
        ),
        legacy = deck.expansionEnum != cardExpansion && card.dokCard.expansions.none { it.expansion == deck.expansionEnum },
    )

    override fun compareTo(other: DokCardInDeck): Int {
        if (house != other.house) return house.compareTo(other.house)
        if (card.cardType != other.card.cardType) return card.cardType.compareTo(other.card.cardType)
        return card.cardTitle.compareTo(other.card.cardTitle)
    }

    val enhanced: Boolean
        get() = bonusAember > 0 || bonusCapture > 0 || bonusDamage > 0 || bonusDraw > 0 || bonusDiscard > 0

    val totalAmber: Int
        get() = this.bonusAember + this.card.amber

    fun toTokenInfo() = TokenInfo(
        name = card.cardTitle,
        house = house,
    )

    fun toSimpleCard() = SimpleCard(
        cardTitle = card.cardTitle,
        cardTitleUrl = card.cardTitleUrl,
        rarity = rarity,
        maverick = maverick,
        anomaly = anomaly,
        enhanced = enhanced,
        legacy = legacy,
        bonusDraw = bonusDraw,
        bonusCapture = bonusCapture,
        bonusAember = bonusAember,
        bonusDamage = bonusDamage,
        bonusDiscard = bonusDiscard,
    )

}
