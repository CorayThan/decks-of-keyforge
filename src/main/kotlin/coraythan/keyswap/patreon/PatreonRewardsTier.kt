package coraythan.keyswap.patreon

enum class PatreonRewardsTier(val tierIds: List<String>, val canSaveNotifications: Boolean = false) {
    NOTICE_BARGAINS(listOf("3351357")), // $1
    SUPPORT_SOPHISTICATION(listOf("3281536"), true), // $5
    MERCHANT_AEMBERMAKER(listOf("3509683"), true), // $10
    ALWAYS_GENEROUS(listOf("3358580", "3281558"), true) // $25 Exclusive tier or $50
}
