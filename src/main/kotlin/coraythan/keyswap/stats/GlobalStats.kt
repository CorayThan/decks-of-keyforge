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
        val totalArmor: List<BarData> = listOf(),
        val aerc: List<BarData> = listOf(),
        val amberControl: List<BarData> = listOf(),
        val expectedAmber: List<BarData> = listOf(),
        val artifactControl: List<BarData> = listOf(),
        val creatureControl: List<BarData> = listOf(),

        val creatures: List<BarData> = listOf(),
        val actions: List<BarData> = listOf(),
        val artifacts: List<BarData> = listOf(),
        val upgrades: List<BarData> = listOf(),

        val sasWinRate: List<BarData>? = listOf(),
        val cardRatingsWinRate: List<BarData>? = listOf(),
        val synergyWinRate: List<BarData>? = listOf(),
        val antisynergyWinRate: List<BarData>? = listOf(),
        val aercWinRate: List<BarData>? = listOf(),
        val amberControlWinRate: List<BarData>? = listOf(),
        val expectedAmberWinRate: List<BarData>? = listOf(),
        val artifactControlWinRate: List<BarData>? = listOf(),
        val creatureControlWinRate: List<BarData>? = listOf(),

        val creatureCountWinRate: List<BarData>? = listOf(),
        val actionCountWinRate: List<BarData>? = listOf(),
        val artifactCountWinRate: List<BarData>? = listOf(),
        val upgradeCountWinRate: List<BarData>? = listOf(),

        val raresWinRate: List<BarData>? = listOf(),
        val houseWinRate: List<BarData>? = listOf()
)

data class BarData(
        val x: Any,
        val y: Any
)
