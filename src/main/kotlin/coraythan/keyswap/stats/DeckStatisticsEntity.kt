package coraythan.keyswap.stats

import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.KeyswapApplication
import coraythan.keyswap.expansions.Expansion
import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

@Entity
data class DeckStatisticsEntity(
        @Lob
        val deckStats: String,

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

    fun toDeckStatistics() = KeyswapApplication.objectMapper.readValue<DeckStatistics>(deckStats)
}

interface DeckStatisticsRepo : CrudRepository<DeckStatisticsEntity, UUID> {
    fun findFirstByCompleteDateTimeNotNullAndExpansionOrderByVersionDesc(expansion: Expansion?): DeckStatisticsEntity?

    fun findFirstByOrderByVersionDesc(): DeckStatisticsEntity?

    fun findAllByVersion(version: Int): List<DeckStatisticsEntity>
}
