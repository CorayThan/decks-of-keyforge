package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.TimeUtils
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.KeyUser
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class AuctionBid(

        @ManyToOne
        val bidder: KeyUser,

        val bidTime: ZonedDateTime,

        val bid: Int,

        @JsonIgnoreProperties("bids")
        @ManyToOne
        val auction: Auction? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) : Comparable<AuctionBid> {
    override fun compareTo(other: AuctionBid): Int {
        if (this.bid == other.bid) {
            return this.bidTime.compareTo(other.bidTime)
        }
        return -this.bid.compareTo(other.bid)
    }

    fun toDto(offsetMinutes: Int = 0) = AuctionBidDto(
            bidderUsername = bidder.username,
            bidTime = bidTime.toReadableStringWithOffsetMinutes(offsetMinutes, TimeUtils.localDateTimeFormatter),
            bid = bid,
            id = id
    )
}

data class AuctionBidDto(
        val bidderUsername: String,
        val bidTime: String,
        val bid: Int,
        val highest: Boolean = false,
        val id: UUID = UUID.randomUUID()
)
