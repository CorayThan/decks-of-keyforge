package coraythan.keyswap.keyforgeevents.tournaments

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.users.KeyUser
import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class TournamentOrganizer(

        @JsonIgnoreProperties("organizers")
        @ManyToOne
        val tourney: Tournament,

        @ManyToOne
        val organizer: KeyUser,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentOrganizerRepo : CrudRepository<TournamentOrganizer, Long> {
        fun findByTourneyId(tourneyId: Long): List<TournamentOrganizer>
        fun existsByTourneyIdAndOrganizerId(tourneyId: Long, organizerId: UUID): Boolean
        fun deleteAllByTourneyId(tourneyId: Long)
}
