package coraythan.keyswap.emails

data class SellerMessage(
        val username: String,
        val deckName: String,
        val deckKeyforgeId: String,
        val senderUsername: String,
        val senderEmail: String,
        val message: String
)
