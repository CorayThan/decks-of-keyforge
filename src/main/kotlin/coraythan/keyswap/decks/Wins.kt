package coraythan.keyswap.decks

import java.math.RoundingMode
import java.text.DecimalFormat

private val roundWinRate = DecimalFormat("#.##").apply {
    roundingMode = RoundingMode.HALF_UP
}

data class Wins(
        val wins: Int = 0,
        val losses: Int = 0
) {
    fun toWinPercent(): Double {
        val winRate = (wins.toDouble() / (wins.toDouble() + losses.toDouble())) * 100
        return roundWinRate.format(winRate).toDouble()
    }
}

fun <T> MutableMap<T, Wins>.addWinsLosses(key: T, wins: Wins) {
    val currentKey = this[key]
    if (currentKey == null) {
        this[key] = wins
    } else {
        this[key] = currentKey.copy(wins = currentKey.wins + wins.wins, losses = currentKey.losses + wins.losses)
    }
}
