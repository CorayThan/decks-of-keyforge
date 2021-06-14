package coraythan.keyswap.keyforgeevents.tournaments

import coraythan.keyswap.House
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.keyforgeevents.KeyForgeEventDto
import java.time.LocalDateTime

@GenerateTs
data class TournamentInfo(
        val tourneyId: Long,
        val name: String,
        val privateTournament: Boolean,
        val organizerAddedDecksOnly: Boolean,
        val showDecksToAllPlayers: Boolean,
        val organizerUsernames: List<String>,
        val joined: Boolean,
        val stage: TournamentStage,
        val registrationClosed: Boolean,
        val deckChoicesLocked: Boolean,
        val verifyParticipants: Boolean,
        val pairingStrategy: PairingStrategy,
        val roundEndsAt: LocalDateTime?,
        val timeExtendedMinutes: Int?,
        val event: KeyForgeEventDto,
        val rounds: List<TournamentRoundInfo>,
        val rankings: List<TournamentRanking>,
        val tournamentDecks: List<TournamentDeckInfo>,
)

@GenerateTs
data class TournamentRoundInfo(
        val roundNumber: Int,
        val roundId: Long,
        val pairings: List<TournamentPairingInfo>,
        val pairingStrategy: PairingStrategy,
)

@GenerateTs
data class TournamentPairingInfo(
        val table: Int,
        val pairId: Long,
        val rematch: Boolean,
        val playerOneId: Long,
        val playerOneUsername: String,
        val playerOneDokUser: Boolean,
        val playerOneWins: Int,

        val playerTwoId: Long?,
        val playerTwoUsername: String?,
        val playerTwoDokUser: Boolean,
        val playerTwoWins: Int?,

        val playerOneScore: Int? = null,
        val playerTwoScore: Int? = null,

        val playerOneWon: Boolean? = null,


        val tcoLink: String? = null,
        val deckIds: List<String> = listOf(),
)

@GenerateTs
data class TournamentRanking(
        val ranking: Int,
        val username: String,
        val dokUser: Boolean,
        val participantId: Long,
        val wins: Int,
        val losses: Int,
        val byes: Int,
        val strengthOfSchedule: Double,
        val extendedStrengthOfSchedule: Double,
        val score: Int,
        val opponentsScore: Int,
        val dropped: Boolean,
        val verified: Boolean,
        val discord: String?,
        val tcoUsername: String?,
        val decks: List<TournamentDeckInfo>,
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

@GenerateTs
data class TournamentDeckInfo(
        val id: Long,
        val keyforgeId: String,
        val name: String,
        val sas: Int,
        val houses: List<House>,
        val username: String,
        val dokUser: Boolean,
        val hasVerificationImage: Boolean,
        val tournamentDeckId: Long,
)
