package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.nowLocal
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class Offer(

        val amount: Int,

        @JsonIgnoreProperties("offers")
        @ManyToOne
        val auction: Auction,

        val message: String,

        @Enumerated(EnumType.STRING)
        val status: OfferStatus = OfferStatus.SENT,

        val sentTime: LocalDateTime = nowLocal(),
        val viewedTime: LocalDateTime? = null,
        val resolvedTime: LocalDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
)

enum class OfferStatus {
    SENT,
    ACCEPTED,
    REJECTED
}

data class MakeOffer(
        val auctionId: UUID,
        val amount: Int,
        val message: String
)
