package coraythan.keyswap.keyforgeevents.tournamentdecks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.keyforgeevents.tournaments.PairingStrategy
import coraythan.keyswap.keyforgeevents.tournaments.Tournament
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class TournamentRound(

        @JsonIgnoreProperties("rounds")
        @ManyToOne
        val tourney: Tournament,

        val roundNumber: Int,

        @Enumerated(EnumType.STRING)
        val pairedWithStrategy: PairingStrategy,

        val active: Boolean = false,

        val startedOn: LocalDateTime? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentRoundRepo : CrudRepository<TournamentRound, Long> {
    fun findFirstByTourneyIdOrderByRoundNumberDesc(id: Long): TournamentRound?
    fun deleteAllByTourneyId(tourneyId: Long)
}
