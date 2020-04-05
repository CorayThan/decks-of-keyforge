package coraythan.keyswap.auctions.purchases

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.TimeUtils
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.generic.Country
import coraythan.keyswap.nowLocal
import coraythan.keyswap.toReadableStringWithOffsetMinutes
import coraythan.keyswap.users.KeyUser
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
data class Purchase(

        @ManyToOne(fetch = FetchType.LAZY)
        val deck: Deck,

        val saleAmount: Int,

        @Enumerated(EnumType.STRING)
        val saleType: SaleType,

        val currencySymbol: String? = null,

        @Enumerated(EnumType.STRING)
        val sellerCountry: Country? = null,
        @Enumerated(EnumType.STRING)
        val buyerCountry: Country? = null,

        @JsonIgnoreProperties("sales")
        @ManyToOne(fetch = FetchType.LAZY)
        val seller: KeyUser? = null,

        @JsonIgnoreProperties("purchases")
        @ManyToOne(fetch = FetchType.LAZY)
        val buyer: KeyUser? = null,

        val purchasedOn: LocalDateTime = nowLocal(),
        val shippedOn:  LocalDateTime? = null,
        val receivedOn:  LocalDateTime? = null,

        val trackingNumber: String? = null,
        val trackingServiceUrl: String? = null,

        @Id
        val id: UUID = UUID.randomUUID()
) {
        fun toSearchResult(offsetMinutes: Int) = PurchaseSearchResult(
                id = id,
                deckKeyforgeId = deck.keyforgeId,
                deckName = deck.name,
                saleAmount = saleAmount,
                saleType = saleType,
                purchasedOn = purchasedOn.toReadableStringWithOffsetMinutes(offsetMinutes, TimeUtils.nonreadableLocalDateFormatterWithYear),
                currencySymbol = currencySymbol,
                sellerCountry = sellerCountry,
                buyerCountry = buyerCountry,
                sellerUsername = seller?.username,
                buyerUsername = buyer?.username
        )
}
