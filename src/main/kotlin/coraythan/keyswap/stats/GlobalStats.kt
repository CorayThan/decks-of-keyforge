package coraythan.keyswap.stats

data class GlobalStats(
        val averageActions: Int = 14,
        val averageArtifacts: Int = 4,
        val averageCreatures: Int = 17,
        val averageUpgrades: Int = 1,
        val averageExpectedAmber: Int = 0,
        val averageAmberControl: Int = 0,
        val averageCreatureControl: Int = 0,
        val averageArtifactControl: Int = 0,
        val sas: List<BarData> = listOf(),
        val cardsRating: List<BarData> = listOf(),
        val synergy: List<BarData> = listOf(),
        val antisynergy: List<BarData> = listOf(),
        val totalCreaturePower: List<BarData> = listOf(),
        val totalArmor: List<BarData> = listOf()
)

data class BarData(
        val x: Any,
        val y: Any
)
