package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
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
        val auction: Auction,

        @Id
        val id: UUID = UUID.randomUUID()
) {
     fun toDto() = AuctionBidDto(
             bidderUsername = bidder.username,
             bidTime = bidTime,
             bid = bid,
             id = id
     )
 }

data class AuctionBidDto(
        val bidderUsername: String,
        val bidTime: ZonedDateTime,
        val bid: Int,
        val id: UUID = UUID.randomUUID()
)
