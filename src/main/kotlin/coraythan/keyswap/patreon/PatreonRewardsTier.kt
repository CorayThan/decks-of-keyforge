package coraythan.keyswap.patreon

enum class PatreonRewardsTier(val tierIds: List<String>, val maxNotifications: Int = 0, val maxApiRequests: Int = coraythan.keyswap.publicapis.maxApiRequests) {
    NOTICE_BARGAINS(listOf("3351357", "5546595")), // $3
    SUPPORT_SOPHISTICATION(listOf("3281536", "5546600"), 25, 50), // $6
    MERCHANT_AEMBERMAKER(listOf("3509683", "5546606"), 25, 100), // $12
    ALWAYS_GENEROUS(listOf("3358580", "3281558"), 50, 250) // $25+
}

fun PatreonRewardsTier?.levelAtLeast(tier: PatreonRewardsTier): Boolean {
    if (this == null) return false
    return this.ordinal >= tier.ordinal
}
