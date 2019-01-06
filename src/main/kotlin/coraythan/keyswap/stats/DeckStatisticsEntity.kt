package coraythan.keyswap.stats

import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.KeyswapApplication
import org.slf4j.LoggerFactory
import org.springframework.data.repository.CrudRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

@Entity
data class DeckStatisticsEntity(
        @Lob
        val deckStats: String,

        @Id
        val id: UUID = UUID.randomUUID()
) {

    companion object {
        fun fromDeckStatistics(deckStats: DeckStatistics) = DeckStatisticsEntity(
                KeyswapApplication.objectMapper.writeValueAsString(deckStats)
        )
    }

    fun toDeckStatistics() = KeyswapApplication.objectMapper.readValue<DeckStatistics>(deckStats)
}

@Transactional
@Service
class DeckStatisticsService(
        val deckStatisticsRepo: DeckStatisticsRepo
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    var cachedStats: DeckStatistics? = null

    @Scheduled(fixedRateString = "PT1H")
    fun updateCachedStats() {
        val all = deckStatisticsRepo.findAll().toList()
        cachedStats = when {
            all.isEmpty() -> null
            else -> {
                log.info("Updated Cached stats to a real value")
                all[0].toDeckStatistics()
            }
        }
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
    }
}

interface DeckStatisticsRepo : CrudRepository<DeckStatisticsEntity, UUID>
