package coraythan.keyswap.stats

import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.roundToTwoSigDig

data class AercData(

        // Card count
        val count: Int,

        val expansion: Expansion,
        val house: House? = null,

        val amberControl: Double = 0.0,
        val expectedAmber: Double = 0.0,
        val artifactControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val effectivePower: Double = 0.0,
        val efficiency: Double = 0.0,
        val disruption: Double = 0.0,
        val creatureProtection: Double = 0.0,
        val other: Double = 0.0
) {
    fun toAverages(): AercData {

        if (count == 0) {
            return this
        }

        return this.copy(
                amberControl = findAverage(amberControl),
                expectedAmber = findAverage(expectedAmber),
                artifactControl = findAverage(artifactControl),
                creatureControl = findAverage(creatureControl),
                effectivePower = findAverage(effectivePower / 10),
                efficiency = findAverage(efficiency),
                disruption = findAverage(disruption),
                creatureProtection = findAverage(creatureProtection),
                other = findAverage(other)
        )
    }

    private fun findAverage(averageOf: Double): Double {

        val averaged = if (house == null) {
            averageOf / (count * 3)
        } else {
            averageOf / count
        }

        return averaged.roundToTwoSigDig()
    }
}
