package coraythan.keyswap.teams

import java.util.*

data class TeamOrInvites(
        val team: TeamInfo? = null,
        val invites: List<TeamInviteInfo>
)

data class TeamInfo(
        val members: List<String>,
        val invites: List<String>,
        val leader: String,
        val name: String
)

data class TeamInviteInfo(
        val teamName: String,
        val teamId: UUID
)