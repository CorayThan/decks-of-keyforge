package coraythan.keyswap.cards

import coraythan.keyswap.House
import coraythan.keyswap.cards.dokcards.DokCardExpansion
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.roundToOneSigDig
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
        get() = if ((wins) < 1) 0.0 else if (losses < 1) 100.0 else {
            val totalGames = (wins + losses).toDouble()
            val winsNumerator = (wins * 100).toDouble()
            val winRatePercent = winsNumerator / totalGames
            winRatePercent.roundToOneSigDig()
        }
}
