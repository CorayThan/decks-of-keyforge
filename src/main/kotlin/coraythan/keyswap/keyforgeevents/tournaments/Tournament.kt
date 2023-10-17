package coraythan.keyswap.keyforgeevents.tournaments

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.generatets.GenerateTs
import jakarta.persistence.*
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime

@Entity
data class Tournament(

        val name: String,

        val privateTourney: Boolean = false,

        val registrationClosed: Boolean = false,

        val deckChoicesLocked: Boolean = false,
        val organizerAddedDecksOnly: Boolean = false,
        val showDecksToAllPlayers: Boolean = true,
        val verifyParticipants: Boolean = false,
        val allowSelfReporting: Boolean = true,

        @Enumerated(EnumType.STRING)
        val visibility: TournamentVisibility = TournamentVisibility.PUBLIC,

        @Enumerated(EnumType.STRING)
        val pairingStrategy: PairingStrategy = PairingStrategy.SWISS_SOS,

        @Enumerated(EnumType.STRING)
        val stage: TournamentStage = TournamentStage.TOURNAMENT_NOT_STARTED,

        @JsonIgnoreProperties("tourney")
        @OneToMany(mappedBy = "tourney", fetch = FetchType.LAZY)
        val rounds: List<TournamentRound> = listOf(),

        @JsonIgnoreProperties("tourney")
        @OneToMany(mappedBy = "tourney", fetch = FetchType.LAZY)
        val organizers: List<TournamentOrganizer> = listOf(),

        @JsonIgnoreProperties("tournament")
        @OneToMany(mappedBy = "tournament", fetch = FetchType.LAZY)
        val participants: List<TournamentParticipant> = listOf(),

        val started: LocalDateTime? = null,
        val ended: LocalDateTime? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1,
)

interface TournamentRepo : CrudRepository<Tournament, Long>

@GenerateTs
enum class PairingStrategy {
    SWISS_SOS,
    SWISS_RANDOM,
    MANUAL_PAIRING,
}
