package coraythan.keyswap.auctions.offers

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.TimeUtils.localDateTimeFormatterWithYear
import coraythan.keyswap.auctions.DeckListing
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import coraythan.keyswap.nowLocal
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.KeyUser
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

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

        val senderArchived: Boolean = false,
        val recipientArchived: Boolean = false,

        val expiresTime: LocalDateTime,

        val sentTime: LocalDateTime = nowLocal(),
        val viewedTime: LocalDateTime? = null,
        val resolvedTime: LocalDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) : Comparable<Offer> {

    fun offerDetailsReadable() = "${auction.currencySymbol}${amount}"

    fun toDto(offsetMinutes: Int): OfferDto {
        return OfferDto(
                deckListingId = this.auction.id,
                deckId = this.auction.deck.keyforgeId,
                amount = this.amount,
                message = this.message,
                status = this.status,
                recipientArchived = recipientArchived,
                senderArchived = senderArchived,
                sentBy = this.sender.username,
                receivedBy = this.recipient.username,
                expired = this.expiresTime.isBefore(LocalDateTime.now()),
                sentTime = this.sentTime.toReadableStringWithOffsetMinutes(offsetMinutes, localDateTimeFormatterWithYear),
                expiresOn = this.expiresTime.toReadableStringWithOffsetMinutes(offsetMinutes, localDateTimeFormatterWithYear),
                viewedTime = this.viewedTime?.toReadableStringWithOffsetMinutes(offsetMinutes, localDateTimeFormatterWithYear),
                resolvedTime = this.viewedTime?.toReadableStringWithOffsetMinutes(offsetMinutes, localDateTimeFormatterWithYear),
                country = offerFrom,
                id = id
        )
    }
    override fun compareTo(other: Offer): Int {
        return if (this.sentTime == other.sentTime) {
            this.id.compareTo(other.id)
         } else {
            return this.sentTime.compareTo(other.sentTime)
        }
    }
}

fun List<Offer>.toOffersForDeck(offsetMinutes: Int): OffersForDeck {
    val firstOffer = this.first()
    val auction = firstOffer.auction
    val deck = auction.deck
    return OffersForDeck(
            OfferDeckData(
                    deck.keyforgeId,
                    deck.name,
                    auction.currencySymbol,
                    deck.sasRating
            ),
            this.sortedDescending().map { it.toDto(offsetMinutes) }
    )
}

@GenerateTs
enum class OfferStatus {
    SENT,
    ACCEPTED,
    REJECTED,
    CANCELED,
    EXPIRED
}

@GenerateTs
data class MakeOffer(
        val deckListingId: UUID,
        val amount: Int,
        val message: String,
        val expireInDays: Int
)

@GenerateTs
data class OfferDto(
        val deckListingId: UUID,
        val deckId: String,
        val amount: Int,
        val message: String,
        val status: OfferStatus,
        val senderArchived: Boolean,
        val recipientArchived: Boolean,
        val expired: Boolean,
        val country: Country,
        val sentTime: String,
        val receivedBy: String,
        val sentBy: String?,
        val expiresOn: String,
        val viewedTime: String?,
        val resolvedTime: String?,
        val id: UUID
)

@GenerateTs
data class OffersForDeck(
        val deck: OfferDeckData,
        val offers: List<OfferDto>
)

@GenerateTs
data class OfferDeckData(
        val id: String,
        val name: String,
        val currency: String,
        val sas: Int
)

@GenerateTs
data class MyOffers(
        val offersToMe: List<OffersForDeck>,
        val offersIMade: List<OffersForDeck>
)
