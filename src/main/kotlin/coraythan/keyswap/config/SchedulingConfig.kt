package coraythan.keyswap.config

object SchedulingConfig {
    const val updateUserStatsInitialDelay = "PT10S"
    const val rateDecksInitialDelay = "PT45S"
    const val importNewDecksInitialDelay = "PT75S"
    const val purchasesInitialDelay = "PT1M"
    const val postProcessDecksDelay = "PT3M"
    const val countDecksIntialDelay = "PT1M"
    const val unexpiredDecksInitialDelay = "PT5M"
    const val expireOffersInitialDelay = "PT6M"
    const val publishNewSasInitialDelay = "PT10M"
    const val newDeckStatsInitialDelay = "PT15M"
    const val updateAllianceDecksInitialDelay = "PT45M"
    const val removeManualPatronsInitialDelay = "PT1H"
    const val correctCountsInitialDelay = "PT6H"
}
