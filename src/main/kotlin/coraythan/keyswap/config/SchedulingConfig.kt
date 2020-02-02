package coraythan.keyswap.config

object SchedulingConfig {
    const val updateUserStats = "PT10S"
    const val importNewDecks = "PT30S"
    const val cleanUnregisteredDecks = "PT3M"
    const val rateDecksDelay = "PT4M"
    const val unexpiredDecksInitialDelay = "PT5M"
    const val winsLossesInitialDelay = "PT10M"
    const val newDeckStatsInitialDelay = "PT15M"
    const val removeManualPatrons = "PT20M"
}
