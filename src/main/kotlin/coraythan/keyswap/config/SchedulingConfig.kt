package coraythan.keyswap.config

object SchedulingConfig {
    const val updateUserStatsInitialDelay = "PT10S"
    const val importNewDecksInitialDelay = "PT15S"
    const val purchasesInitialDelay = "PT1M"
    const val rateDecksInitialDelay = "PT2M"
    const val postProcessDecksDelay = "PT3M"
    const val unexpiredDecksInitialDelay = "PT5M"
    const val expireOffersInitialDelay = "PT6M"
    const val winsLossesInitialDelay = "PT10M"
    const val newDeckStatsInitialDelay = "PT15M"
    const val removeManualPatronsInitialDelay = "PT1H"
    const val correctCountsInitialDelay = "PT6H"
}
