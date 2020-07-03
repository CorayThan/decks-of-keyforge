package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.auctions.offers.Offer
import coraythan.keyswap.auctions.purchases.SaleType
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckLanguage
import coraythan.keyswap.generic.Country
import coraythan.keyswap.now
import coraythan.keyswap.userdeck.DeckCondition
import coraythan.keyswap.users.KeyUser
import java.time.LocalDate
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

@Entity
data class DeckListing(

        val durationDays: Int = 7,

        val endDateTime: ZonedDateTime,

        val bidIncrement: Int? = null,

        val startingBid: Int? = null,

        val buyItNow: Int? = null,

        @JsonIgnoreProperties("buyItNows")
        @ManyToOne
        val boughtWithBuyItNow: KeyUser? = null,

        val boughtNowOn: ZonedDateTime? = null,

        @Enumerated(EnumType.STRING)
        val status: DeckListingStatus = DeckListingStatus.AUCTION,

        @JsonIgnoreProperties("auction")
        @OneToMany(mappedBy = "auction", cascade = [CascadeType.ALL])
        val bids: List<AuctionBid> = listOf(),

        @JsonIgnoreProperties("auction")
        @OneToMany(mappedBy = "auction", cascade = [CascadeType.ALL])
        val offers: List<Offer> = listOf(),

        @JsonIgnoreProperties("auctions")
        @ManyToOne
        val deck: Deck,

        @JsonIgnoreProperties("auctions")
        @ManyToOne
        val seller: KeyUser,

        val currencySymbol: String,

        @Enumerated(EnumType.STRING)
        val forSaleInCountry: Country,

        @Enumerated(EnumType.STRING)
        val language: DeckLanguage,

        val condition: DeckCondition,
        val redeemed: Boolean = true,
        val externalLink: String? = null,
        val listingInfo: String? = null,
        val shippingCost: String? = null,

        val dateListed: ZonedDateTime = now(),

        val forTrade: Boolean = false,
        val acceptingOffers: Boolean = false,

        val hasOwnershipVerification: Boolean = false,

        @Id
        val id: UUID = UUID.randomUUID()
) {
    private fun realMaxBidObject() = bids.sorted().firstOrNull()
    fun realMaxBid() = realMaxBidObject()?.bid
    fun highestBidder() = realMaxBidObject()?.bidder

    val saleType: SaleType
        get() {
            return when {
                acceptingOffers -> SaleType.OFFER
                bidIncrement != null -> SaleType.AUCTION
                else -> SaleType.STANDARD
            }
        }

    val isActive: Boolean
        get() {
            return status != DeckListingStatus.COMPLETE
        }

    val highestOffer: Int?
        get() {
            return offers.map { it.amount }.max()
        }

    val highestBid: Int?
        get() {
            val bidsFiltered = bids
                    .groupBy { it.bidder }
                    .map { bid -> bid.value.sorted().first() }
            return when {
                bidsFiltered.isEmpty() -> null
                bidsFiltered.size == 1 -> startingBid
                else -> bidsFiltered.sorted()[1].bid
            }
        }

    val highestBidderUsername: String?
        get() = highestBidder()?.username

    val nextBid: Int?
        get() {
            val highBid = highestBid
            return if (highBid == null) {
                startingBid
            } else {
                highBid + (bidIncrement ?: 1)
            }
        }

    fun toUserDeckListingInfo(): UserDeckListingInfo {
        return UserDeckListingInfo(
                status = status,
                forTrade = forTrade,
                bidsExist = status == DeckListingStatus.AUCTION && bids.isNotEmpty(),
                deckId = deck.id,
                id = id
        )
    }

    fun toDto(offsetMinutes: Int = 0): DeckListingDto {
        val highestBid = highestBid
        return DeckListingDto(
                dateListed = dateListed,
                durationDays = durationDays,
                endDateTime = endDateTime,
                bidIncrement = bidIncrement,
                startingBid = startingBid,
                buyItNow = buyItNow,
                status = status,
                highestBid = highestBid,
                bids = bids
                        .sortedByDescending { it.bidTime }
                        .map {
                            it.toDto(offsetMinutes).copy(
                                    bid = if (highestBid != null && it.bid > highestBid) highestBid else it.bid,
                                    highest = it == realMaxBidObject()
                            )
                        },
                highestOffer = highestOffer,
                deckId = deck.id,
                currencySymbol = currencySymbol,
                language = language,
                condition = condition,
                listingInfo = listingInfo,
                externalLink = externalLink,
                forTrade = forTrade,
                acceptingOffers = acceptingOffers,
                id = id
        )
    }
}

data class DeckListingDto(
        val dateListed: ZonedDateTime,
        val durationDays: Int = 7,
        val endDateTime: ZonedDateTime,
        val bidIncrement: Int? = 5,
        val startingBid: Int? = null,
        val buyItNow: Int? = null,
        val status: DeckListingStatus = DeckListingStatus.AUCTION,
        val highestBid: Int? = null,
        val bids: List<AuctionBidDto> = listOf(),
        val deckId: Long,
        val currencySymbol: String,
        val highestOffer: Int? = null,
        val language: DeckLanguage,
        val condition: DeckCondition,
        val listingInfo: String?,
        val externalLink: String?,
        val forTrade: Boolean,
        val acceptingOffers: Boolean = false,
        val id: UUID
) {
    val dateListedLocalDate: LocalDate
        get() = this.dateListed.toLocalDate()

    val expiresAtLocalDate: LocalDate
        get() = this.endDateTime.toLocalDate()
}

data class UserDeckListingInfo(
        val status: DeckListingStatus,
        val forTrade: Boolean,
        val deckId: Long,
        val bidsExist: Boolean,
        val id: UUID
)

enum class DeckListingStatus {
    SALE,
    AUCTION,
    COMPLETE
}
