package coraythan.keyswap.config

object SchedulingConfig {
    const val updateUserStats = "PT10S"
    const val importNewDecks = "PT15S"
    const val cleanUnregisteredDecks = "PT3M"
    const val rateDecksDelay = "PT4M"
    const val unexpiredDecksInitialDelay = "PT5M"
    const val expireOffers = "PT6M"
    const val recurringWinLossTask = "PT2M"
    const val winsLossesInitialDelay = "PT10M"
    const val newDeckStatsInitialDelay = "PT15M"
    const val removeManualPatrons = "PT20M"
}
