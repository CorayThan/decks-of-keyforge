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
        val expiresInDays: Int = 3,
        val viewedTime: LocalDateTime? = null,
        val resolvedTime: LocalDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) : Comparable<Offer> {
    fun toDto(offsetMinutes: Int) = OfferDto(
            deckListingId = this.auction.id,
            deckId = this.auction.deck.keyforgeId,
            amount = this.amount,
            message = this.message,
            status = this.status,
            sentTime = this.sentTime.toReadableStringWithOffsetMinutes(offsetMinutes),
            expiresOn = this.sentTime.plusDays(this.expiresInDays.toLong()).toReadableStringWithOffsetMinutes(offsetMinutes),
            viewedTime = this.viewedTime?.toReadableStringWithOffsetMinutes(offsetMinutes),
            resolvedTime = this.viewedTime?.toReadableStringWithOffsetMinutes(offsetMinutes),
            country = offerFrom,
            id = id
    )

    override fun compareTo(other: Offer): Int {
        return if (this.sentTime == other.sentTime) {
            this.id.compareTo(other.id)
         } else {
            return this.sentTime.compareTo(other.sentTime)
        }
    }
}

enum class OfferStatus {
    SENT,
    ACCEPTED,
    REJECTED,
    CANCELED
}

data class MakeOffer(
        val deckListingId: UUID,
        val amount: Int,
        val message: String,
        val expireInDays: Int
)

data class OfferDto(
        val deckListingId: UUID,
        val deckId: String,
        val amount: Int,
        val message: String,
        val status: OfferStatus,
        val country: Country,
        val sentTime: String,
        val expiresOn: String,
        val viewedTime: String?,
        val resolvedTime: String?,
        val id: UUID
)

data class MyOffers(
        val offersToMe: List<OfferDto>,
        val offersIMade: List<OfferDto>
)
