package coraythan.keyswap.cards

import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.nowLocal
import jakarta.persistence.Entity
import jakarta.persistence.Id
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*

@GenerateTs
@Entity
data class CardEditHistory(

    val extraCardInfoId: UUID,
    val editorId: UUID,

    val beforeEditExtraCardInfoJson: String,

    val created: LocalDateTime = nowLocal(),

    @Id
    val id: UUID = UUID.randomUUID(),
)

interface CardEditHistoryRepo : CrudRepository<CardEditHistory, UUID> {
    fun findAllByExtraCardInfoIdIn(ids: List<UUID>): List<CardEditHistory>
}
