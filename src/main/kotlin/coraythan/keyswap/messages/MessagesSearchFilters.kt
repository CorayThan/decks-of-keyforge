package coraythan.keyswap.messages

import coraythan.keyswap.generatets.GenerateTs
import java.util.*

@GenerateTs
data class MessagesSearchFilters(
        val toId: UUID? = null,
        val fromId: UUID? = null,
        val unreadOnly: Boolean = true,
        val includeHidden: Boolean = false,
        val conversationMessageId: Long? = null,
        val pageSize: Long = 25,
        val page: Long = 0,
)
