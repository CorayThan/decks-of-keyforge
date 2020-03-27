package coraythan.keyswap.emails

data class SellerMessage(
        val username: String,
        val deckName: String,
        val deckKeyforgeId: String,
        val message: String
)
