package coraythan.keyswap.keyforgeevents.tournamentdecks

import org.springframework.data.repository.CrudRepository
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@Entity
data class TournamentPairing(

        val playerOneId: Long,

        val playerTwoId: Long?,

        val eventId: Long,
        val roundId: Long,

        val playerOneKeys: Int? = null,
        val playerTwoKeys: Int? = null,

        val playerOneWon: Boolean? = null,

        val tcoLink: String? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentPairingRepo : CrudRepository<TournamentPairing, Long> {
    fun findAllByEventId(eventId: Long): List<TournamentPairing>
    fun findAllByRoundId(roundId: Long): List<TournamentPairing>
}
