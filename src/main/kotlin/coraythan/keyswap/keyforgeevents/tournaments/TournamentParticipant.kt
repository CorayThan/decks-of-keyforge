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
        val participantId: UUID,

        val dropped: Boolean = false,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentParticipantRepo : CrudRepository<TournamentParticipant, Long> {
        fun findByEventIdAndParticipantId(eventId: Long, participantId: UUID): TournamentParticipant?
        fun findAllByEventIdAndDroppedFalse(eventId: Long): List<TournamentParticipant>
}

data class ParticipantStats(
        val participant: TournamentParticipant,
        var wins: Int = 0,
        var losses: Int = 0,
        var strengthOfSchedule: Double = 0.0,
        var extendedStrengthOfSchedule: Double = 0.0,
        val keys: Int = 0,
)
