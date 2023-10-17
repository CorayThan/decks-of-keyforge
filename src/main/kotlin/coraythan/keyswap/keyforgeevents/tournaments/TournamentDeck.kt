package coraythan.keyswap.keyforgeevents.tournaments

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class TournamentDeck(

        @JsonIgnoreProperties("tournamentDecks")
        @ManyToOne
        val deck: Deck,

        val participantId: Long,

        val deckOrder: Int,

        val tourneyId: Long,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1,
)

interface TournamentDeckRepo : CrudRepository<TournamentDeck, Long> {
    fun findByTourneyId(tourneyId: Long): List<TournamentDeck>
    fun findByParticipantId(participantId: Long): List<TournamentDeck>
    fun deleteByParticipantId(participantId: Long)
    fun deleteAllByTourneyId(tourneyId: Long)
}
