package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.users.KeyUser
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.Id
import javax.persistence.ManyToOne

// @Entity
data class AuctionBid(

        val bidder: KeyUser,

        val bidTime: ZonedDateTime,

        val bid: Int,

        @JsonIgnoreProperties("bids")
        @ManyToOne
        val auction: Auction,

        @Id
        val id: UUID = UUID.randomUUID()
)