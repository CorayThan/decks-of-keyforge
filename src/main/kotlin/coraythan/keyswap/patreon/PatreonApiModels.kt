package coraythan.keyswap.patreon

import com.fasterxml.jackson.annotation.JsonProperty

data class PatreonUser(
        val data: PatreonUserData
)

data class PatreonUserData(
        val id: String
)

data class PatreonCampaigns(
        val data: List<PatreonCampaignMember>,
        val meta: PatreonCampaignsMeta?
)

data class PatreonCampaignsMeta(
        val pagination: PatreonPagination
)

data class PatreonPagination(
        val cursors: PatreonNext?
)

data class PatreonNext(
        val next: String
)

data class PatreonCampaignMember(
        val id: String,
        val attributes: PatreonMemberAttributes,
        val relationships: PatreonMemberRelationships
)

data class PatreonMemberAttributes(
        @JsonProperty("lifetime_support_cents")
        val lifetimeSupportCents: Int
)

data class PatreonMemberRelationships(
        @JsonProperty("currently_entitled_tiers")
        val currentlyEntitledTiers: PatreonIdDataList,

        val user: PatreonIdData
)

data class PatreonIdDataList(
        val data: List<PatreonIdAndType>
)

data class PatreonIdData(
        val data: PatreonIdAndType
)

data class PatreonIdAndType(
        val id: String
)
