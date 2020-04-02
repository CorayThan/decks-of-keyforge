package coraythan.keyswap.auctions.purchases

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.generic.Country
import coraythan.keyswap.nowLocal
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class Purchase(

        @ManyToOne(fetch = FetchType.LAZY)
        val deck: Deck,

        @JsonIgnoreProperties("sales")
        @ManyToOne(fetch = FetchType.LAZY)
        val seller: KeyUser,

        @JsonIgnoreProperties("purchases")
        @ManyToOne(fetch = FetchType.LAZY)
        val buyer: KeyUser,

        val saleAmount: Int,
        val currencySymbol: String,

        @Enumerated(EnumType.STRING)
        val saleType: SaleType,

        @Enumerated(EnumType.STRING)
        val sellerCountry: Country,
        @Enumerated(EnumType.STRING)
        val buyerCountry: Country,

        val purchasedOn: LocalDateTime = nowLocal(),
        val shippedOn:  LocalDateTime? = null,
        val receivedOn:  LocalDateTime? = null,

        val trackingNumber: String? = null,
        val trackingServiceUrl: String? = null,

        @Id
        val id: UUID = UUID.randomUUID()
)

enum class SaleType {
        STANDARD,
        OFFER,
        AUCTION
}
