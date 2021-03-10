package coraythan.keyswap.keyforgeevents

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import coraythan.keyswap.generic.USState
import coraythan.keyswap.keyforgeevents.tournamentdecks.TournamentRound
import coraythan.keyswap.keyforgeevents.tournaments.TournamentStage
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import javax.persistence.*

@Entity
data class KeyForgeEvent(
        val name: String,
        val description: String,
        val startDateTime: LocalDateTime,
        val banner: String?,
        val entryFee: String?,
        val duration: String?,
        val signupLink: String,
        val discordServer: String?,
        val online: Boolean,
        val sealed: Boolean,

        @Enumerated(EnumType.STRING)
        val format: KeyForgeFormat,

        @Enumerated(EnumType.STRING)
        val country: Country?,

        @Enumerated(EnumType.STRING)
        val state: USState?,

        @ManyToOne
        val createdBy: KeyUser,
        val promoted: Boolean,

        val runTournament: Boolean = false,
        val privateTournament: Boolean = false,

        @Enumerated(EnumType.STRING)
        val tournamentStage: TournamentStage = TournamentStage.TOURNAMENT_NOT_STARTED,

        val created: LocalDateTime = nowLocal(),

        @JsonIgnoreProperties("tourney")
        @OneToMany(mappedBy = "tourney", fetch = FetchType.LAZY)
        val rounds: List<TournamentRound> = listOf(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1,
) {
        fun toDto() = KeyForgeEventDto(
                name,
                description,
                startDateTime,
                banner,
                entryFee,
                duration,
                signupLink,
                discordServer,
                online,
                sealed,
                runTournament,
                tournamentStage,
                format,
                country,
                state,
                createdByUsername = createdBy.username,
                id,
        )
}

@GenerateTs
data class KeyForgeEventDto(
        val name: String,
        val description: String,
        val startDateTime: LocalDateTime,
        val banner: String?,
        val entryFee: String?,
        val duration: String?,
        val signupLink: String,
        val discordServer: String?,
        val online: Boolean,
        val sealed: Boolean,
        val hasTournament: Boolean,
        val tournamentStage: TournamentStage,

        val format: KeyForgeFormat,
        val country: Country?,

        val state: USState?,

        val createdByUsername: String?,
        val id: Long?
)
