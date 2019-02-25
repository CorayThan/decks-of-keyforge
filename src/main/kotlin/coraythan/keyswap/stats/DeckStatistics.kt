package coraythan.keyswap.stats

import coraythan.keyswap.House
import coraythan.keyswap.decks.Wins

// First is value, second is occurrances for that value in all decks
data class DeckStatistics(
        val armorValues: Map<Int, Int>,
        val totalCreaturePower: Map<Int, Int>,
        val expectedAmber: Map<Int, Int>,
        val amberControl: Map<Int, Int>,
        val creatureControl: Map<Int, Int>,
        val artifactControl: Map<Int, Int>,
        val sas: Map<Int, Int>,
        val cardsRating: Map<Int, Int>,
        val synergy: Map<Int, Int>,
        val antisynergy: Map<Int, Int>,
        val creatureCount: Map<Int, Int>,
        val actionCount: Map<Int, Int>,
        val artifactCount: Map<Int, Int>,
        val upgradeCount: Map<Int, Int>,
        val power2OrLower: Map<Int, Int>,
        val power3OrLower: Map<Int, Int>,
        val power3OrHigher: Map<Int, Int>,
        val power4OrHigher: Map<Int, Int>,
        val power5OrHigher: Map<Int, Int>,

        val sasToWinsLosses: Map<Int, Wins>,
        val cardRatingsToWinsLosses: Map<Int, Wins>,
        val synergyToWinsLosses: Map<Int, Wins>,
        val antisynergyToWinsLosses: Map<Int, Wins>,
        val amberControlToWinsLosses: Map<Int, Wins>,
        val expectedAmberToWinsLosses: Map<Int, Wins>,
        val artifactControlToWinsLosses: Map<Int, Wins>,
        val creatureControlToWinsLosses: Map<Int, Wins>,

        val creatureWins: Map<Int, Wins>,
        val actionWins: Map<Int, Wins>,
        val artifactWins: Map<Int, Wins>,
        val upgradeWins: Map<Int, Wins>,

        val raresWins: Map<Int, Wins>,
        val housesWins: Map<House, Wins>
) {
    val armorStats = IndividalDeckTraitStats.fromValues(armorValues)
    val totalCreaturePowerStats = IndividalDeckTraitStats.fromValues(totalCreaturePower)
    val expectedAmberStats = IndividalDeckTraitStats.fromValues(expectedAmber)
    val amberControlStats = IndividalDeckTraitStats.fromValues(amberControl)
    val creatureControlStats = IndividalDeckTraitStats.fromValues(creatureControl)
    val artifactControlStats = IndividalDeckTraitStats.fromValues(artifactControl)
    val sasStats = IndividalDeckTraitStats.fromValues(sas)
    val cardsRatingStats = IndividalDeckTraitStats.fromValues(cardsRating)
    val synergyStats = IndividalDeckTraitStats.fromValues(synergy)
    val antisynergyStats = IndividalDeckTraitStats.fromValues(antisynergy, true)
    val creatureCountStats = IndividalDeckTraitStats.fromValues(creatureCount)
    val actionCountStats = IndividalDeckTraitStats.fromValues(actionCount)
    val artifactCountStats = IndividalDeckTraitStats.fromValues(artifactCount)
    val upgradeCountStats = IndividalDeckTraitStats.fromValues(upgradeCount)
    val power2OrLowerStats = IndividalDeckTraitStats.fromValues(power2OrLower)
    val power3OrLowerStats = IndividalDeckTraitStats.fromValues(power3OrLower)
    val power3OrHigherStats = IndividalDeckTraitStats.fromValues(power3OrHigher)
    val power4OrHigherStats = IndividalDeckTraitStats.fromValues(power4OrHigher)
    val power5OrHigherStats = IndividalDeckTraitStats.fromValues(power5OrHigher)

    fun toGlobalStats() = GlobalStats(
            averageActions = actionCountStats.median,
            averageArtifacts = artifactCountStats.median,
            averageCreatures = creatureCountStats.median,
            averageUpgrades = upgradeCountStats.median,
            averageExpectedAmber = expectedAmberStats.median,
            averageAmberControl = amberControlStats.median,
            averageCreatureControl = creatureControlStats.median,
            averageArtifactControl = artifactControlStats.median,
            sas = sas.map { BarData(it.key, it.value) },
            cardsRating = cardsRating.map { BarData(it.key, it.value) },
            synergy = synergy.map { BarData(it.key, it.value) },
            antisynergy = antisynergy.map { BarData(it.key, it.value) },
            totalCreaturePower = groupCreaturePowerByTens(),
            totalArmor = armorValues.map { BarData(it.key, it.value) },
            amberControl = amberControl.map { BarData(it.key, it.value) },
            expectedAmber = expectedAmber.map { BarData(it.key, it.value) },
            artifactControl = artifactControl.map { BarData(it.key, it.value) },
            creatureControl = creatureControl.map { BarData(it.key, it.value) },

            creatures = creatureCount.map { BarData(it.key, it.value) },
            actions = actionCount.map { BarData(it.key, it.value) },
            artifacts = artifactCount.map { BarData(it.key, it.value) },
            upgrades = upgradeCount.map { BarData(it.key, it.value) },

            sasWinRate = sasToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            cardRatingsWinRate = cardRatingsToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            synergyWinRate = synergyToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            antisynergyWinRate = antisynergyToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            amberControlWinRate = amberControlToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            expectedAmberWinRate = expectedAmberToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            artifactControlWinRate = artifactControlToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },
            creatureControlWinRate = creatureControlToWinsLosses.map { BarData(it.key, it.value.toWinPercent()) },

            creatureCountWinRate = creatureWins.map { BarData(it.key, it.value.toWinPercent()) },
            actionCountWinRate = actionWins.map { BarData(it.key, it.value.toWinPercent()) },
            artifactCountWinRate = artifactWins.map { BarData(it.key, it.value.toWinPercent()) },
            upgradeCountWinRate = upgradeWins.map { BarData(it.key, it.value.toWinPercent()) },

            raresWinRate = raresWins.map { BarData(it.key, it.value.toWinPercent()) },
            houseWinRate = housesWins.map { BarData(it.key, it.value.toWinPercent()) }
    )

    fun groupCreaturePowerByTens(): List<BarData> {
        return totalCreaturePower.keys.groupBy { it / 5 }.toList().map { BarData(it.first * 5, it.second.map { totalCreaturePower[it]!! }.sum()) }
    }
}

data class IndividalDeckTraitStats(
        val min: Int,
        val max: Int,
        val median: Int,
        val top90Percent: Int,
        val bottom10Percent: Int,
        val percentile40: Int,
        val percentile60: Int,
        val percentileForValue: Map<Int, Int>
) {
    companion object {

        fun fromValues(values: Map<Int, Int>, reverse: Boolean = false): IndividalDeckTraitStats {
            val keysSorted = if (reverse) values.keys.sortedDescending() else values.keys.sorted()
            val total = values.values.sum()
            val medianIndex = total / 2
            val top90PercentIndex = total * 0.9
            val bottom10PercentIndex = total * 0.1
            val percentile40Index = total * 0.4
            val percentile60Index = total * 0.6

            var currentIndex = 0
            var bottom10Percent: Int = -1
            var median: Int = -1
            var top90Percent: Int = -1
            var percentile40 = -1
            var percentile60 = -1
            var currentPercentile: Int
            val percentileForValue = mutableMapOf<Int, Int>()
            keysSorted.forEach {
                currentIndex += values[it]!!
                currentPercentile = (currentIndex * 100) / total
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
                    keysSorted.first(),
                    keysSorted.last(),
                    median,
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
