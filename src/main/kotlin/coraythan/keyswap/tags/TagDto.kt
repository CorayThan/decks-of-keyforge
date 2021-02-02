package coraythan.keyswap.tags

import coraythan.keyswap.generatets.GenerateTs
import java.time.LocalDateTime

@GenerateTs
data class TagDto(
        val name: String,
        val creatorUsername: String,
        val publicityType: PublicityType,
        val views: Int,
        val viewsThisMonth: Int,
        val created: LocalDateTime,
        val archived: Boolean,
        val id: Long,
        val deckQuantity: Int?,
)
