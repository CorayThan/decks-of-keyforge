package coraythan.keyswap.patreon

import com.fasterxml.jackson.annotation.JsonProperty

data class PatreonUser(
        val data: PatreonUserData
)

data class PatreonUserData(
        val id: String
)

data class PatreonCampaigns(
        val data: List<PatreonCampaignMember>
)

data class PatreonCampaignMember(
        val id: String,
        val relationships: PatreonMemberRelationships
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
