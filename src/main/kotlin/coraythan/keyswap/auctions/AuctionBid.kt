package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
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
) {
    fun toDto(offsetMinutes: Int = 0) = AuctionBidDto(
            bidderUsername = bidder.username,
            bidTime = bidTime.toReadableStringWithOffsetMinutes(offsetMinutes),
            bid = bid,
            id = id
    )
}

data class AuctionBidDto(
        val bidderUsername: String,
        val bidTime: String,
        val bid: Int,
        val id: UUID = UUID.randomUUID()
)
