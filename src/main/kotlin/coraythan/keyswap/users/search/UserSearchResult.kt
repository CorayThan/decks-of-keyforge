package coraythan.keyswap.users.search

import com.fasterxml.jackson.annotation.JsonIgnore
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.teams.Team
import coraythan.keyswap.users.UserType

data class UserSearchResult(
        val username: String,
        val deckCount: Int,
        val forSaleCount: Int,
        val topSasAverage: Int,
        val highSas: Int,
        val lowSas: Int,
        val totalPower: Int,
        val totalChains: Int,
        val mavericks: Int,
        val anomalies: Int,
        val role: UserType,
        val patreonTier: PatreonRewardsTier?,
        val manualPatreonTier: PatreonRewardsTier?,

        @JsonIgnore
        val team: Team?
) {
    val teamName = team?.name
}
