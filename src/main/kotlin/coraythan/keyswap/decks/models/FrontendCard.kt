package coraythan.keyswap.decks.models

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardNumberSetPair
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.cards.dokcards.DokCardExpansion
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.roundToTwoSigDig

@GenerateTs
data class FrontendCard(
    val id: Long,
    val houses: List<House>,
    val cardTitle: String,
    val cardTitleUrl: String,
    val cardType: CardType,
    val cardText: String,
    val traits: List<String>,
    val amber: Int,
    val power: Int,
    val armor: Int,
    val rarity: Rarity,
    val flavorText: String?,
    val big: Boolean,
    val token: Boolean,
    val wins: Int,
    val losses: Int,
    val extraCardInfo: ExtraCardInfo,
    val expansions: List<DokCardExpansion>,
    val cardNumbers: List<CardNumberSetPair>,
) {
    val winRate: Double
        get() = if (wins + losses < 1) 0.0 else (wins.toDouble() / wins.toDouble() + losses.toDouble()).roundToTwoSigDig()
}
