package coraythan.keyswap.keyforgeevents.tournamentparticipants

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.keyforgeevents.tournaments.Tournament
import coraythan.keyswap.roundToTwoSigDig
import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class TournamentParticipant(

        @JsonIgnoreProperties("participants")
        @ManyToOne
        val tournament: Tournament,

        // One of userId or tourneyUserName should be non-null
        val userId: UUID? = null,

        val tourneyUserName: String? = null,

        val dropped: Boolean = false,

        val pairedDown: Boolean = false,

        val verified: Boolean = false,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentParticipantRepo : CrudRepository<TournamentParticipant, Long> {
    fun findByTournamentIdAndUserId(eventId: Long, userId: UUID): TournamentParticipant?
    fun findByTournamentIdAndTourneyUserName(eventId: Long, tourneyUserName: String): TournamentParticipant?
    fun existsByTournamentIdAndUserId(tournamentId: Long, userId: UUID): Boolean
    fun existsByTournamentIdAndTourneyUserName(tournamentId: Long, tourneyUserName: String): Boolean
    fun findAllByTournamentId(tournamentId: Long): List<TournamentParticipant>
    fun countByTournamentId(tournamentId: Long): Long
    fun deleteAllByTournamentId(tournamentId: Long)
}

data class ParticipantStats(
        val participant: TournamentParticipant,
        val wins: Int = 0,
        val losses: Int = 0,
        val byes: Int = 0,
        var strengthOfSchedule: Double = 0.0,
        var extendedStrengthOfSchedule: Double = 0.0,
        val score: Int = 0,
        val opponentsScore: Int = 0,
        val dropped: Boolean = false,
) {
    fun totalSosScore() = (wins * 100 + strengthOfSchedule * 10 + extendedStrengthOfSchedule).roundToTwoSigDig()
}

val participantStatsComparator = compareBy<ParticipantStats>({it.wins}, {it.strengthOfSchedule}, {it.extendedStrengthOfSchedule})
