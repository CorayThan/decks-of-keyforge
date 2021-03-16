package coraythan.keyswap.keyforgeevents.tournamentparticipants

import coraythan.keyswap.roundToTwoSigDig
import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@Entity
data class TournamentParticipant(
        val eventId: Long,
        val userId: UUID,

        val dropped: Boolean = false,

        val pairedDown: Boolean = false,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentParticipantRepo : CrudRepository<TournamentParticipant, Long> {
    fun findByEventIdAndUserId(eventId: Long, userId: UUID): TournamentParticipant?
    fun existsByEventIdAndUserId(eventId: Long, userId: UUID): Boolean
    fun findAllByEventId(eventId: Long): List<TournamentParticipant>
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
