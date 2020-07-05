package coraythan.keyswap.sellerratings

import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class  SellerRating(
        // 1 to 5
        override val rating: Int,
        val title: String,
        val review: String,

        override val sellerId: UUID,

        @ManyToOne
        val reviewer: KeyUser,

        val deckPurchasedId: Long? = null,

        val created: LocalDateTime = nowLocal(),

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) : SellerRatingScores
