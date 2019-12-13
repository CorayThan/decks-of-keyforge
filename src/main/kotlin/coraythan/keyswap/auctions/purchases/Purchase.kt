package coraythan.keyswap.auctions.purchases

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class Purchase(

        @ManyToOne
        val deck: Deck,

        @JsonIgnoreProperties("sales")
        @ManyToOne
        val seller: KeyUser,

        @JsonIgnoreProperties("purchases")
        @ManyToOne
        val buyer: KeyUser,

        val auctionId: UUID,

        val saleAmount: Int,
        val currencySymbol: String,

        val purchasedOn: LocalDateTime = nowLocal(),
        val shippedOn:  LocalDateTime? = null,
        val receivedOn:  LocalDateTime? = null,

        val trackingNumber: String? = null,
        val trackingServiceUrl: String? = null,

        @Id
        val id: UUID = UUID.randomUUID()
)