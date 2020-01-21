package coraythan.keyswap.auctions.offers

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.auctions.DeckListing
import coraythan.keyswap.generic.Country
import coraythan.keyswap.nowLocal
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class Offer(

        val amount: Int,

        @JsonIgnoreProperties("offers")
        @ManyToOne
        val auction: DeckListing,

        @ManyToOne
        val recipient: KeyUser,
        @ManyToOne
        val sender: KeyUser,

        val message: String,

        @Enumerated(EnumType.STRING)
        val offerFrom: Country,

        @Enumerated(EnumType.STRING)
        val status: OfferStatus = OfferStatus.SENT,

        val sentTime: LocalDateTime = nowLocal(),
        val viewedTime: LocalDateTime? = null,
        val resolvedTime: LocalDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {
    fun toDto(offsetMinutes: Int) = OfferDto(
            auctionId = this.auction.id,
            deckId = this.auction.deck.keyforgeId,
            amount = this.amount,
            message = this.message,
            status = this.status,
            sentTime = this.sentTime.toReadableStringWithOffsetMinutes(offsetMinutes),
            viewedTime = this.viewedTime?.toReadableStringWithOffsetMinutes(offsetMinutes),
            resolvedTime = this.viewedTime?.toReadableStringWithOffsetMinutes(offsetMinutes),
            id = id
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
        val deckId: String,
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
