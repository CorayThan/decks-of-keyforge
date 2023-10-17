package coraythan.keyswap.keyforgeevents.tournaments

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime

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

        val timeExtendedMinutes: Int? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1,
)

interface TournamentRoundRepo : CrudRepository<TournamentRound, Long> {
    fun findFirstByTourneyIdOrderByRoundNumberDesc(id: Long): TournamentRound?
    fun deleteAllByTourneyId(tourneyId: Long)
}
