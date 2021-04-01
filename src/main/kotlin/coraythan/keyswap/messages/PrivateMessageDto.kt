package coraythan.keyswap.messages

import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.generatets.GenerateTs
import java.time.LocalDateTime
import java.util.*

@GenerateTs
data class PrivateMessageDto(
        val toId: UUID,
        val toUsername: String,
        val fromId: UUID,
        val fromUsername: String,
        val subject: String,
        val message: String,
        val sent: LocalDateTime,
        val viewed: LocalDateTime? = null,
        val replied: LocalDateTime? = null,

        val replyToId: Long? = null,

        val deck: SimpleDeckSearchResult? = null,
)
