package coraythan.keyswap.users.search

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.users.UserType
import java.util.*

@GenerateTs
data class UserSearchResult(
        val id: UUID,
        val username: String,
        val rating: Double,
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
        val teamId: UUID?,
        val allowUsersToSeeDeckOwnership: Boolean = true,
)
