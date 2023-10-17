package coraythan.keyswap.keyforgeevents.tournaments

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.users.KeyUser
import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository
import java.util.*

@Entity
data class TournamentOrganizer(

        @JsonIgnoreProperties("organizers")
        @ManyToOne
        val tourney: Tournament,

        @ManyToOne
        val organizer: KeyUser,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1,
)

interface TournamentOrganizerRepo : CrudRepository<TournamentOrganizer, Long> {
        fun existsByTourneyIdAndOrganizerId(tourneyId: Long, organizerId: UUID): Boolean
        fun deleteAllByTourneyId(tourneyId: Long)
}
