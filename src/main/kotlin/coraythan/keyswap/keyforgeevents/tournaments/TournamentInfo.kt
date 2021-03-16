package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class TournamentInfo(
        val tourneyId: Long,
        val name: String,
        val privateTournament: Boolean,
        val organizerUsernames: List<String>,
        val joined: Boolean,
        val containsDecks: Boolean,
        val stage: TournamentStage,
        val rounds: List<TournamentRoundInfo>,
        val rankings: List<TournamentRanking>,
)

@GenerateTs
data class TournamentRoundInfo(
        val roundNumber: Int,
        val roundId: Long,
        val pairings: List<TournamentPairingInfo>
)

@GenerateTs
data class TournamentPairingInfo(
        val table: Int,
        val pairId: Long,
        val playerOneId: Long,
        val playerOneUsername: String,
        val playerOneWins: Int,

        val playerTwoId: Long?,
        val playerTwoUsername: String?,
        val playerTwoWins: Int?,

        val playerOneScore: Int? = null,
        val playerTwoScore: Int? = null,

        val playerOneWon: Boolean? = null,

        val tcoLink: String? = null,
)

@GenerateTs
data class TournamentRanking(
        val ranking: Int,
        val username: String,
        val participantId: Long,
        val wins: Int,
        val losses: Int,
        val byes: Int,
        val strengthOfSchedule: Double,
        val extendedStrengthOfSchedule: Double,
        val score: Int,
        val opponentsScore: Int,
        val dropped: Boolean,
        val decks: List<SimpleDeckSearchResult>,
) {
    fun fullRankValue() = (wins * 10000) + (strengthOfSchedule * 100) + extendedStrengthOfSchedule
}

@GenerateTs
enum class TournamentStage {
    TOURNAMENT_NOT_STARTED,
    PAIRING_IN_PROGRESS,
    GAMES_IN_PROGRESS,
    VERIFYING_ROUND_RESULTS,
    TOURNAMENT_COMPLETE,
}
