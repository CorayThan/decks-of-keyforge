package coraythan.keyswap.messages

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class SendMessage(
        val toUsername: String,
        val subject: String,
        val message: String,
        val deckId: Long?,
        val replyToId: Long?,
)
