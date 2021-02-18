package coraythan.keyswap.emails

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class SellerMessage(
        val username: String,
        val deckName: String,
        val deckKeyforgeId: String,
        val message: String
)
