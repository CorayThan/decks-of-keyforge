package coraythan.keyswap.messages

import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.generatets.GenerateTs
import java.time.LocalDateTime
import java.util.*

@GenerateTs
data class PrivateMessageDto(
        val id: Long,
        val toId: UUID,
        val toUsername: String,
        val fromId: UUID,
        val fromUsername: String,
        val subject: String,
        val message: String,
        val hidden: Boolean,
        val sent: LocalDateTime,
        val viewed: LocalDateTime? = null,
        val replied: LocalDateTime? = null,

        val fullyViewed: Boolean = true,

        val replyToId: Long? = null,

        val replies: List<PrivateMessageDto> = listOf(),

        val deck: SimpleDeckSearchResult? = null,
)
