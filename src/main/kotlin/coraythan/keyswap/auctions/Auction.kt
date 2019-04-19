package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.userdeck.UserDeck
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

@Entity
data class Auction(

        val durationDays: Int = 7,

        val endDateTime: ZonedDateTime,

        val bidIncrement: Int = 5,

        val startingBid: Int = 0,

        val buyItNow: Int? = null,

        val complete: Boolean = false,

        @OneToOne(mappedBy = "auction")
        val userDeck: UserDeck? = null,

        @JsonIgnoreProperties("auction")
        @OneToMany(mappedBy = "auction", cascade = [CascadeType.ALL])
        val bids: List<AuctionBid> = listOf(),

        @Id
        val id: UUID = UUID.randomUUID()
) {
    fun realMaxBid() = bids.sortedBy { it.bid }.reversed()[0].bid

    val highestBid: Int?
        get() {
            val bidsFiltered = bids
                    .groupBy { it.bidder }
                    .map { bid -> bid.value.sortedByDescending { it.bid }.first() }
            return when {
                bidsFiltered.isEmpty() -> null
                bidsFiltered.size == 1 -> startingBid
                else -> bidsFiltered.sortedByDescending { it.bid }[1].bid
            }
        }

    val highestBidderUsername: String?
        get() = bids.sortedByDescending { it.bid }.firstOrNull()?.bidder?.username

    val nextBid: Int
        get() {
            val highBid = highestBid
            return if (highBid == null) {
                startingBid
            } else {
                highBid + bidIncrement
            }
        }

    fun toDto() = AuctionDto(
            durationDays = durationDays,
            endDateTime = endDateTime,
            bidIncrement = bidIncrement,
            startingBid = startingBid,
            buyItNow = buyItNow,
            complete = complete,
            highestBid = highestBid,
            bids = bids.map { it.toDto() }.sortedByDescending { it.bidTime },
            id = id
    )
}

data class AuctionDto(
        val durationDays: Int = 7,
        val endDateTime: ZonedDateTime,
        val bidIncrement: Int = 5,
        val startingBid: Int = 0,
        val buyItNow: Int? = null,
        val complete: Boolean = false,
        val highestBid: Int? = null,
        val bids: List<AuctionBidDto> = listOf(),
        val id: UUID
)
