package coraythan.keyswap.keyforgeevents.tournamentdecks

import org.springframework.data.repository.CrudRepository
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

@Entity
data class TournamentDeck(

        val keyforgeDeckId: String,

        val participantId: Long,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentDeckRepo : CrudRepository<TournamentDeck, Long>