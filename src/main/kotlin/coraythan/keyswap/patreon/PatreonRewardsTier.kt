package coraythan.keyswap.patreon

enum class PatreonRewardsTier(val tierIds: List<String>, val maxNotifications: Int = 0, val maxApiRequests: Int = coraythan.keyswap.publicapis.maxApiRequests) {
    NOTICE_BARGAINS(listOf("3351357")), // $1
    SUPPORT_SOPHISTICATION(listOf("3281536"), 25, 50), // $5
    MERCHANT_AEMBERMAKER(listOf("3509683"), 25, 100), // $10
    ALWAYS_GENEROUS(listOf("3358580", "3281558"), 50, 250) // $25 Exclusive tier or $50
}

fun PatreonRewardsTier?.levelAtLeast(tier: PatreonRewardsTier): Boolean {
    if (this == null) return false
    return this.ordinal >= tier.ordinal
}
