package coraythan.keyswap.keyforgeevents.tournamentdecks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import org.springframework.data.repository.CrudRepository
import javax.persistence.*

@Entity
data class TournamentDeck(

        @JsonIgnoreProperties("tournamentDecks")
        @ManyToOne
        val deck: Deck,

        val participantId: Long,

        val deckOrder: Int,

        val tourneyId: Long,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
)

interface TournamentDeckRepo : CrudRepository<TournamentDeck, Long> {
    fun findByTourneyId(tourneyId: Long): List<TournamentDeck>
    fun findByParticipantId(participantId: Long): List<TournamentDeck>
    fun existsByTourneyId(tourneyId: Long): Boolean
    fun deleteByParticipantId(participantId: Long)
    fun deleteAllByTourneyId(tourneyId: Long)
}
