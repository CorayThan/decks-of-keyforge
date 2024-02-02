package coraythan.keyswap.stats

import coraythan.keyswap.House
import coraythan.keyswap.decks.Wins
import coraythan.keyswap.roundToOneSigDig

// First is value, second is occurrences for that value in all decks
data class DeckStatistics(
        val armorValues: MutableMap<Int, Int> = mutableMapOf(),
        val totalCreaturePower: MutableMap<Int, Int> = mutableMapOf(),
        val aerc: MutableMap<Int, Int> = mutableMapOf(),
        val expectedAmber: MutableMap<Int, Int> = mutableMapOf(),
        val amberControl: MutableMap<Int, Int> = mutableMapOf(),
        val creatureControl: MutableMap<Int, Int> = mutableMapOf(),
        val artifactControl: MutableMap<Int, Int> = mutableMapOf(),
        val efficiency: MutableMap<Int, Int> = mutableMapOf(),
        val recursion: MutableMap<Int, Int> = mutableMapOf(),
        val disruption: MutableMap<Int, Int> = mutableMapOf(),
        val creatureProtection: MutableMap<Int, Int> = mutableMapOf(),
        val other: MutableMap<Int, Int> = mutableMapOf(),
        val effectivePower: MutableMap<Int, Int> = mutableMapOf(),
        val sas: MutableMap<Int, Int> = mutableMapOf(),
        val meta: MutableMap<Int, Int> = mutableMapOf(),
        val synergy: MutableMap<Int, Int> = mutableMapOf(),
        val antisynergy: MutableMap<Int, Int> = mutableMapOf(),
        val creatureCount: MutableMap<Int, Int> = mutableMapOf(),
        val actionCount: MutableMap<Int, Int> = mutableMapOf(),
        val artifactCount: MutableMap<Int, Int> = mutableMapOf(),
        val upgradeCount: MutableMap<Int, Int> = mutableMapOf(),
        val power2OrLower: MutableMap<Int, Int> = mutableMapOf(),
        val power3OrLower: MutableMap<Int, Int> = mutableMapOf(),
        val power3OrHigher: MutableMap<Int, Int> = mutableMapOf(),
        val power4OrHigher: MutableMap<Int, Int> = mutableMapOf(),
        val power5OrHigher: MutableMap<Int, Int> = mutableMapOf(),

        val sasToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val metaToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val cardRatingsToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val synergyToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val antisynergyToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val aercToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val amberControlToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val expectedAmberToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val artifactControlToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val creatureControlToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val efficiencyToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val recursionToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val disruptionToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val creatureProtectionToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val otherToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),
        val effectivePowerToWinsLosses: MutableMap<Int, Wins> = mutableMapOf(),

        val creatureWins: MutableMap<Int, Wins> = mutableMapOf(),
        val actionWins: MutableMap<Int, Wins> = mutableMapOf(),
        val artifactWins: MutableMap<Int, Wins> = mutableMapOf(),
        val upgradeWins: MutableMap<Int, Wins> = mutableMapOf(),

        val raresWins: MutableMap<Int, Wins> = mutableMapOf(),
        val housesWins: MutableMap<House, Wins> = mutableMapOf(),

        var aercDatas: List<AercData> = listOf()
) {
    val expectedAmberStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(expectedAmber)
    val amberControlStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(amberControl)
    val creatureControlStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(creatureControl)
    val artifactControlStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(artifactControl)
    val efficiencyStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(efficiency)
    val recursionStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(recursion)
    val disruptionStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(disruption)
    val creatureProtectionStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(creatureProtection)
    val otherStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(other)
    val effectivePowerStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(effectivePower)
    val sasStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(sas)
    val synergyStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(synergy)
    val antisynergyStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(antisynergy, true)
    val creatureCountStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(creatureCount)
    val actionCountStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(actionCount)
    val artifactCountStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(artifactCount)
    val upgradeCountStats: IndividalDeckTraitStats
        get() = IndividalDeckTraitStats.fromValues(upgradeCount)

    fun toGlobalStats() = GlobalStats(
            averageActions = actionCountStats.mean.roundToOneSigDig(),
            averageArtifacts = artifactCountStats.mean.roundToOneSigDig(),
            averageCreatures = creatureCountStats.mean.roundToOneSigDig(),
            averageUpgrades = upgradeCountStats.mean.roundToOneSigDig(),
            averageExpectedAmber = expectedAmberStats.median,
            averageAmberControl = amberControlStats.median,
            averageCreatureControl = creatureControlStats.median,
            averageArtifactControl = artifactControlStats.median,
            averageEfficiency = efficiencyStats.median,
            averageRecursion = recursionStats.median,
            averageDisruption = disruptionStats.median,
            averageCreatureProtection = creatureProtectionStats.median,
            averageOther = otherStats.median,
            averageEffectivePower = effectivePowerStats.median,
            sas = sas.map { BarData(it.key, it.value) },
            meta = meta.map { BarData(it.key, it.value) },
            synergy = synergy.map { BarData(it.key, it.value) },
            antisynergy = antisynergy.map { BarData(it.key, it.value) },
            totalCreaturePower = groupCreaturePowerByTens(),
            totalArmor = armorValues.map { BarData(it.key, it.value) },
            aerc = aerc.map { BarData(it.key, it.value) },
            amberControl = amberControl.map { BarData(it.key, it.value) },
            expectedAmber = expectedAmber.map { BarData(it.key, it.value) },
            artifactControl = artifactControl.map { BarData(it.key, it.value) },
            creatureControl = creatureControl.map { BarData(it.key, it.value) },
            efficiency = efficiency.map { BarData(it.key, it.value) },
            recursion = recursion.map { BarData(it.key, it.value) },
            disruption = disruption.map { BarData(it.key, it.value) },
            creatureProtection = creatureProtection.map { BarData(it.key, it.value) },
            other = other.map { BarData(it.key, it.value) },
            effectivePower = groupEffectiveCreaturePowerByTens(),

            creatures = creatureCount.map { BarData(it.key, it.value) },
            actions = actionCount.map { BarData(it.key, it.value) },
            artifacts = artifactCount.map { BarData(it.key, it.value) },
            upgrades = upgradeCount.map { BarData(it.key, it.value) },

            sasWinRate = sasToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            metaWinRate = metaToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            cardRatingsWinRate = cardRatingsToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            synergyWinRate = synergyToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            antisynergyWinRate = antisynergyToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            aercWinRate = aercToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            amberControlWinRate = amberControlToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            expectedAmberWinRate = expectedAmberToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            artifactControlWinRate = artifactControlToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            creatureControlWinRate = creatureControlToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            efficiencyWinRate = efficiencyToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            recursionWinRate = recursionToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            disruptionWinRate = disruptionToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            creatureProtectionWinRate = creatureProtectionToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            otherWinRate = otherToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            effectivePowerWinRate = effectivePowerToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },

            creatureCountWinRate = creatureWins.map { BarData(it.key, it.value.toWinPercent()) },
            actionCountWinRate = actionWins.map { BarData(it.key, it.value.toWinPercent()) },
            artifactCountWinRate = artifactWins.map { BarData(it.key, it.value.toWinPercent()) },
            upgradeCountWinRate = upgradeWins.map { BarData(it.key, it.value.toWinPercent()) },

            raresWinRate = raresWins.map { BarData(it.key, it.value.toWinPercent()) },
            houseWinRate = housesWins.map { BarData(it.key, it.value.toWinPercent()) }.sortedBy { it.x as House },

            actionCountPercentiles = actionCountStats.percentileForValue,
            creatureCountPercentiles = creatureCountStats.percentileForValue,
            artifactCountPercentiles = artifactCountStats.percentileForValue,
            upgradeCountPercentiles = upgradeCountStats.percentileForValue,

            amberControlPercentiles = amberControlStats.percentileForValue,
            expectedAmberPercentiles = expectedAmberStats.percentileForValue,
            creatureProtectionPercentiles = creatureProtectionStats.percentileForValue,
            creatureControlPercentiles = creatureControlStats.percentileForValue,
            artifactControlPercentiles = artifactControlStats.percentileForValue,
            effectivePowerPercentiles = effectivePowerStats.percentileForValue,
            efficiencyPercentiles = efficiencyStats.percentileForValue,
            recursionPercentiles = recursionStats.percentileForValue,
            disruptionPercentiles = disruptionStats.percentileForValue,

            aercDatas = aercDatas.map { it.toAverages() }
    )

    private fun groupCreaturePowerByTens(): List<BarData> {
        return totalCreaturePower.keys.groupBy { it / 5 }.toList().map { BarData(it.first * 5, it.second.map { totalCreaturePower[it]!! }.sum()) }
    }

    private fun groupEffectiveCreaturePowerByTens(): List<BarData> {
        return effectivePower.keys.groupBy { it / 5 }.toList().map { BarData(it.first * 5, it.second.map { effectivePower[it]!! }.sum()) }
    }
}

data class IndividalDeckTraitStats(
        val min: Int,
        val max: Int,
        val median: Int,
        val mean: Double,
        val top90Percent: Int,
        val bottom10Percent: Int,
        val percentile40: Int,
        val percentile60: Int,
        val percentileForValue: MutableMap<Int, Double>
) {

    fun closestPercentileForValue(stat: Int): Double {
        val trueValue = percentileForValue[stat]
        if (trueValue != null) {
            return trueValue
        }

        val possibleStats = percentileForValue.keys.toSortedSet()
            .sortedDescending()
        possibleStats.forEach {
            if (it < stat) return percentileForValue[it] ?: 0.0
        }
        return 0.0
    }

    companion object {

        /**
         * <Int, Int> is Value, Count at Value
         */
        fun fromValues(values: MutableMap<Int, Int> = mutableMapOf(), reverse: Boolean = false): IndividalDeckTraitStats {
            val keysSorted = if (reverse) values.keys.sortedDescending() else values.keys.sorted()
            val totalCount = values.values.sum()
            val medianIndex = totalCount / 2
            val top90PercentIndex = totalCount * 0.9
            val bottom10PercentIndex = totalCount * 0.1
            val percentile40Index = totalCount * 0.4
            val percentile60Index = totalCount * 0.6

            val totalValue = values.entries.sumOf { it.key * it.value }
            val mean: Double = if (totalCount == 0) 0.0 else totalValue.toDouble() / totalCount

            var currentIndex = 0
            var bottom10Percent: Int = -1
            var median: Int = -1
            var top90Percent: Int = -1
            var percentile40 = -1
            var percentile60 = -1
            var currentPercentile: Double
            val percentileForValue = mutableMapOf<Int, Double>()
            keysSorted.forEach {
                currentIndex += values[it]!!
                currentPercentile = (currentIndex.toDouble() * 100.0) / totalCount.toDouble()
                percentileForValue[it] = currentPercentile
                if (bottom10Percent == -1 && currentIndex >= bottom10PercentIndex) {
                    bottom10Percent = it
                }
                if (median == -1 && currentIndex >= medianIndex) {
                    median = it
                }
                if (top90Percent == -1 && currentIndex >= top90PercentIndex) {
                    top90Percent = it
                }
                if (percentile40 == -1 && currentIndex >= percentile40Index) {
                    percentile40 = it
                }
                if (percentile60 == -1 && currentIndex >= percentile60Index) {
                    percentile60 = it
                }
            }

            return IndividalDeckTraitStats(
                    keysSorted.firstOrNull() ?: 0,
                    keysSorted.lastOrNull() ?: 0,
                    median,
                    mean,
                    top90Percent,
                    bottom10Percent,
                    percentile40,
                    percentile60,
                    percentileForValue
            )
        }
    }
}

fun <T> MutableMap<T, Int>.incrementValue(key: T) {
    if (this[key] == null) {
        this[key] = 1
    } else {
        this[key] = this[key]!! + 1
    }
}
