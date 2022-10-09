package coraythan.keyswap.gamestracker

import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import java.time.LocalDateTime

@GenerateTs
data class GamesSet(
    override val won: Int,
    override val lost: Int,
    override val avgOpponentSas: Int,
    override val avgTurnsToWin: Int,
    override val avgTurnsToLose: Int,
    val vsSets: List<DataVsSet>,
    val gamesList: List<MiniGameRecord>
) : GameAvgStats

@GenerateTs
data class DataVsSet(
    val set: Expansion,
    override val won: Int,
    override val lost: Int,
    override val avgOpponentSas: Int,
    override val avgTurnsToWin: Int,
    override val avgTurnsToLose: Int,
) : GameAvgStats

interface GameAvgStats {
    val won: Int
    val lost: Int
    val avgOpponentSas: Int
    val avgTurnsToWin: Int
    val avgTurnsToLose: Int
}

@GenerateTs
data class MiniGameRecord(
    val playerOne: String,
    val playerOneDeck: SimpleDeckSearchResult,
    val playerTwo: String,
    val playerTwoDeck: SimpleDeckSearchResult,
    val winner: String,
    val turns: Int,
    val reportDayTime: String,
    val logs: List<String>,
)
