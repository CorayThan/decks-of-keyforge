package coraythan.keyswap.cards

import coraythan.keyswap.nowLocal
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class CardEditHistory(

    val extraCardInfoId: UUID,
    val editorId: UUID,

    val beforeEditExtraCardInfoJson: String,

    val created: LocalDateTime = nowLocal(),

    @Id
    val id: UUID = UUID.randomUUID(),
)

interface CardEditHistoryRepo : CrudRepository<CardEditHistory, UUID>
