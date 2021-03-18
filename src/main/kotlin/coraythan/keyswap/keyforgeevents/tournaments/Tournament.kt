package coraythan.keyswap.keyforgeevents.tournaments

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.keyforgeevents.tournamentdecks.TournamentRound
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class Tournament(

        val name: String,

        val privateTourney: Boolean = false,

        @Enumerated(EnumType.STRING)
        val type: TournamentType = TournamentType.SWISS,

        @Enumerated(EnumType.STRING)
        val stage: TournamentStage = TournamentStage.TOURNAMENT_NOT_STARTED,

        @JsonIgnoreProperties("tourney")
        @OneToMany(mappedBy = "tourney", fetch = FetchType.LAZY)
        val rounds: List<TournamentRound> = listOf(),

        @JsonIgnoreProperties("tourney")
        @OneToMany(mappedBy = "tourney", fetch = FetchType.LAZY)
        val organizers: List<TournamentOrganizer> = listOf(),

        val started: LocalDateTime? = null,
        val ended: LocalDateTime? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentRepo : CrudRepository<Tournament, Long>

enum class TournamentType {
    SWISS,
    SINGLE_ELIMINATION,
}
