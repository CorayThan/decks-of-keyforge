package coraythan.keyswap.teams

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.users.search.UserSearchResult
import java.util.*

@GenerateTs
data class TeamOrInvites(
        val team: TeamInfo? = null,
        val invites: List<TeamInviteInfo>
)

@GenerateTs
data class TeamInfo(
        val members: List<UserSearchResult>,
        val invites: List<String>,
        val leader: String,
        val name: String
)

@GenerateTs
data class TeamInviteInfo(
        val teamName: String,
        val teamId: UUID
)