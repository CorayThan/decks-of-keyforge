package coraythan.keyswap.messages

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class MessagesSearchFilters(
        val category: MailCategory,
        val pageSize: Long = 25,
        val page: Long = 0,
)
