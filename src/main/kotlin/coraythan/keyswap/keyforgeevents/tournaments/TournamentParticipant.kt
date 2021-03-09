package coraythan.keyswap.keyforgeevents.tournamentparticipants

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

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentParticipantRepo : CrudRepository<TournamentParticipant, Long> {
        fun findByEventIdAndUserId(eventId: Long, userId: UUID): TournamentParticipant?
        fun findAllByEventIdAndDroppedFalse(eventId: Long): List<TournamentParticipant>
        fun findAllByEventId(eventId: Long): List<TournamentParticipant>
}

data class ParticipantStats(
        val participant: TournamentParticipant,
        val wins: Int = 0,
        val losses: Int = 0,
        val byes: Int = 0,
        var strengthOfSchedule: Double = 0.0,
        var extendedStrengthOfSchedule: Double = 0.0,
        val keys: Int = 0,
        val opponentKeys: Int = 0,
)
