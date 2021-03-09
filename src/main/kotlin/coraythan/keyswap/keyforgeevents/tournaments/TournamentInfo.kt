package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class TournamentInfo(
        val tourneyId: Long,
        val organizerUsername: String,
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
        val pairId: Long,
        val playerOneId: Long,
        val playerOneUsername: String,

        val playerTwoId: Long?,
        val playerTwoUsername: String?,

        val playerOneKeys: Int? = null,
        val playerTwoKeys: Int? = null,

        val playerOneWon: Boolean? = null,

        val tcoLink: String? = null,
)

@GenerateTs
data class TournamentRanking(
        val username: String,
        val participantId: Long,
        val wins: Int,
        val losses: Int,
        val byes: Int,
        val strengthOfSchedule: Double,
        val extendedStrengthOfSchedule: Double,
        val keys: Int,
        val opponentKeys: Int,
)
