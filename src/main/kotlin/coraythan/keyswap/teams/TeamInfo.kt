package coraythan.keyswap.teams

import coraythan.keyswap.users.search.UserSearchResult
import java.util.*

data class TeamOrInvites(
        val team: TeamInfo? = null,
        val invites: List<TeamInviteInfo>
)

data class TeamInfo(
        val members: List<UserSearchResult>,
        val invites: List<String>,
        val leader: String,
        val name: String
)

data class TeamInviteInfo(
        val teamName: String,
        val teamId: UUID
)