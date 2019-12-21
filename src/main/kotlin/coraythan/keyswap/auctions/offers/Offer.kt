package coraythan.keyswap.auctions.offers

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.auctions.Auction
import coraythan.keyswap.generic.Country
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class Offer(

        val amount: Int,

        @JsonIgnoreProperties("offers")
        @ManyToOne
        val auction: Auction,

        @ManyToOne
        val recipient: KeyUser,
        @ManyToOne
        val sender: KeyUser,

        val message: String,

        val offerFrom: Country,

        @Enumerated(EnumType.STRING)
        val status: OfferStatus = OfferStatus.SENT,

        val sentTime: LocalDateTime = nowLocal(),
        val viewedTime: LocalDateTime? = null,
        val resolvedTime: LocalDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {
    fun toDto() = OfferDto(
            auctionId = this.auction.id,

    )
}

enum class OfferStatus {
    SENT,
    ACCEPTED,
    REJECTED,
    CANCELED
}

data class MakeOffer(
        val auctionId: UUID,
        val amount: Int,
        val message: String
)

data class OfferDto(
        val auctionId: UUID,
        val amount: Int,
        val message: String,
        val status: OfferStatus,
        val sentTime: String,
        val viewedTime: String?,
        val resolvedTime: String?,
        val id: UUID
)

data class MyOffers(
        val offersToMe: List<OfferDto>,
        val offersIMade: List<OfferDto>
)
