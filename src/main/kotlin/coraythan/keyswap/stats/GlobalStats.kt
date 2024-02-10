package coraythan.keyswap.stats

import coraythan.keyswap.generatets.GenerateTs
import java.time.ZonedDateTime

@GenerateTs
data class GlobalStatsWithExpansion(
        val completedDate: ZonedDateTime?,
        val expansion: Int?,
        val stats: GlobalStats
)

@GenerateTs
data class GlobalStats(
        val averageActions: Double = 14.0,
        val averageArtifacts: Double = 4.0,
        val averageCreatures: Double = 17.0,
        val averageUpgrades: Double = 1.0,
        val averageExpectedAmber: Int = 0,
        val averageAmberControl: Int = 0,
        val averageCreatureControl: Int = 0,
        val averageArtifactControl: Int = 0,
        val averageEfficiency: Int = 0,
        val averageRecursion: Int = 0,
        val averageDisruption: Int = 0,
        val averageCreatureProtection: Int = 0,
        val averageOther: Int = 0,
        val averageEffectivePower:  Int = 0,
        val sas: List<BarData> = listOf(),
        val synergy: List<BarData> = listOf(),
        val antisynergy: List<BarData> = listOf(),
        val totalCreaturePower: List<BarData> = listOf(),
        val totalArmor: List<BarData> = listOf(),
        val aerc: List<BarData> = listOf(),
        val amberControl: List<BarData> = listOf(),
        val expectedAmber: List<BarData> = listOf(),
        val artifactControl: List<BarData> = listOf(),
        val creatureControl: List<BarData> = listOf(),
        val efficiency: List<BarData> = listOf(),
        val recursion: List<BarData> = listOf(),
        val disruption: List<BarData> = listOf(),
        val creatureProtection: List<BarData> = listOf(),
        val other: List<BarData> = listOf(),
        val effectivePower: List<BarData> = listOf(),

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
        val efficiencyWinRate: List<BarData>? = listOf(),
        val recursionWinRate: List<BarData>? = listOf(),
        val disruptionWinRate: List<BarData>? = listOf(),
        val creatureProtectionWinRate: List<BarData>? = listOf(),
        val otherWinRate: List<BarData>? = listOf(),
        val effectivePowerWinRate: List<BarData>? = listOf(),

        val creatureCountWinRate: List<BarData>? = listOf(),
        val actionCountWinRate: List<BarData>? = listOf(),
        val artifactCountWinRate: List<BarData>? = listOf(),
        val upgradeCountWinRate: List<BarData>? = listOf(),

        val houseWinRate: List<BarData>? = listOf(),

        val actionCountPercentiles: Map<Int, Double> = mapOf(),
        val creatureCountPercentiles: Map<Int, Double> = mapOf(),
        val artifactCountPercentiles: Map<Int, Double> = mapOf(),
        val upgradeCountPercentiles: Map<Int, Double> = mapOf(),

        val amberControlPercentiles: Map<Int, Double> = mapOf(),
        val expectedAmberPercentiles: Map<Int, Double> = mapOf(),
        val creatureProtectionPercentiles: Map<Int, Double> = mapOf(),
        val creatureControlPercentiles: Map<Int, Double> = mapOf(),
        val artifactControlPercentiles: Map<Int, Double> = mapOf(),
        val effectivePowerPercentiles: Map<Int, Double> = mapOf(),
        val efficiencyPercentiles: Map<Int, Double> = mapOf(),
        val recursionPercentiles: Map<Int, Double> = mapOf(),
        val disruptionPercentiles: Map<Int, Double> = mapOf(),

        val aercDatas: List<AercData> = listOf()
)

@GenerateTs
data class BarData(
        val x: Any,
        val y: Any
)
