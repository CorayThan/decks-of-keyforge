package coraythan.keyswap.patreon

enum class PatreonRewardsTier(val tierIds: List<String>) {
    NOTICE_BARGAINS(listOf("3351357")), // $1
    SUPPORT_SOPHISTICATION(listOf("3281536")), // $5
    MERCHANT_AEMBERMAKER(listOf("3509683")), // $10
    ALWAYS_GENEROUS(listOf("3358580", "3281558")) // $25 Exclusive tier or $50
}
