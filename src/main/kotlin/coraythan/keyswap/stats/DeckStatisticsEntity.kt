package coraythan.keyswap.stats

import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.KeyswapApplication
import coraythan.keyswap.expansions.Expansion
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*

@Entity
data class DeckStatisticsEntity(

    val deckStatsJson: String,

    val version: Int = 0,

    val completeDateTime: ZonedDateTime? = null,

    @Enumerated(EnumType.STRING)
    val expansion: Expansion? = null,

    @Id
    val id: UUID = UUID.randomUUID()
) {

    companion object {
        fun fromDeckStatistics(deckStats: DeckStatistics, expansion: Expansion? = null) = DeckStatisticsEntity(
            KeyswapApplication.objectMapper.writeValueAsString(deckStats),
            expansion = expansion
        )
    }

    fun toDeckStatistics(): DeckStatistics {
        return KeyswapApplication.objectMapper.readValue(deckStatsJson)
    }
}

interface DeckStatisticsRepo : CrudRepository<DeckStatisticsEntity, UUID> {
    fun findFirstByCompleteDateTimeNotNullAndExpansionOrderByVersionDesc(expansion: Expansion?): DeckStatisticsEntity?

    fun findFirstByOrderByVersionDesc(): DeckStatisticsEntity?

    fun findAllByVersion(version: Int): List<DeckStatisticsEntity>
}
