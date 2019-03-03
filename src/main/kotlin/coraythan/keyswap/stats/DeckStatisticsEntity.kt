package coraythan.keyswap.stats

import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.KeyswapApplication
import org.springframework.data.repository.CrudRepository
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

@Entity
data class DeckStatisticsEntity(
        @Lob
        val deckStats: String,

        val version: Int = 0,

        val completeDateTime: ZonedDateTime? = null,

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

interface DeckStatisticsRepo : CrudRepository<DeckStatisticsEntity, UUID> {
    fun findFirstByCompleteDateTimeNotNullOrderByVersionDesc(): DeckStatisticsEntity?

    fun findFirstByOrderByVersionDesc(): DeckStatisticsEntity?
}
