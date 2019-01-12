package coraythan.keyswap.stats

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class StatsService(
        val deckStatisticsRepo: DeckStatisticsRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    var cachedStats: DeckStatistics? = null
    var cachedGlobalStats: GlobalStats? = null
    val defaultGlobalStats = GlobalStats(
            averageActions = 0,
            averageArtifacts = 0,
            averageCreatures = 0,
            averageUpgrades = 0,
            averageExpectedAmber = 0,
            averageAmberControl = 0,
            averageCreatureControl = 0,
            averageArtifactControl = 0
    )

    fun findGlobalStats(): GlobalStats {
        if (cachedGlobalStats != null) {
            return cachedGlobalStats ?: defaultGlobalStats
        }
        this.updateCachedStats()
        return cachedGlobalStats ?: defaultGlobalStats
    }

    fun findCurrentStats(): DeckStatistics? {
        if (cachedStats != null) {
            return cachedStats
        }
        this.updateCachedStats()
        return cachedStats
    }

    fun setStats(deckStats: DeckStatistics) {
        deckStatisticsRepo.deleteAll()
        deckStatisticsRepo.save(DeckStatisticsEntity.fromDeckStatistics(deckStats))
        updateCachedStats()
    }

    private fun updateCachedStats() {
        val all = deckStatisticsRepo.findAll().toList()
        cachedStats = when {
            all.isEmpty() -> null
            else -> {
                log.info("Updated Cached stats to a real value")
                all[0].toDeckStatistics()
            }
        }
        cachedGlobalStats = cachedStats?.toGlobalStats()
    }
}