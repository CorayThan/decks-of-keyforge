package coraythan.keyswap.auctions

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.userdeck.UserDeck
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.CascadeType
import javax.persistence.Id
import javax.persistence.OneToMany
import javax.persistence.OneToOne

// @Entity
data class Auction(

        val durationDays: Int = 7,

        val endDateTime: ZonedDateTime,

        val bidIncrement: Int = 5,

        val startingBid: Int = 0,

        val buyItNow: Int? = null,

        val complete: Boolean = false,

        @OneToOne(mappedBy = "auction")
        val userDeck: UserDeck,

        @JsonIgnoreProperties("auction")
        @OneToMany(mappedBy = "auction", cascade = [CascadeType.ALL])
        val bids: List<AuctionBid>,

        @Id
        val id: UUID = UUID.randomUUID()
)
