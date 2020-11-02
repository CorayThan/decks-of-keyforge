package coraythan.keyswap.decks.salenotifications

import coraythan.keyswap.House
import coraythan.keyswap.decks.Cap
import coraythan.keyswap.decks.Constraint
import coraythan.keyswap.decks.DeckCardQuantity
import coraythan.keyswap.decks.DeckFilters
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import coraythan.keyswap.users.KeyUser
import java.util.*
import javax.persistence.*

@Entity
data class SaleNotificationQuery(
        val name: String,

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val houses: Set<House> = setOf(),

        @ElementCollection
        @Enumerated(EnumType.STRING)
        val excludeHouses: Set<House> = setOf(),

        val title: String = "",

        val forSale: Boolean? = false,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,
        val forSaleInCountry: Country? = null,

        @ElementCollection
        val expansions: List<Int> = listOf(),

        @OneToMany(cascade = [CascadeType.ALL])
        val constraints: List<SaleNotificationConstraint> = listOf(),

        @OneToMany(cascade = [CascadeType.ALL])
        val cards: List<SaleNotificationDeckCardQuantity> = listOf(),

        val owner: String = "",

        @ManyToOne
        val user: KeyUser,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
) {
    fun toDto(): SaleNotificationQueryDto {

        val query = SaleNotificationQueryDto(
                name,
                houses,
                excludeHouses,
                title,
                forSale,
                forTrade,
                forAuction,
                forSaleInCountry,
                expansions,
                constraints.map { Constraint(it.property, it.cap, it.value) },
                cards.map {
                    DeckCardQuantity(it.cardNames, it.quantity, it.house, it.mav)
                },
                owner,
                user.id,
                id
        )

        // toString to prevent lazy load exceptions
        query.toString()

        return query
    }
}

@GenerateTs
data class SaleNotificationQueryDto(
        val name: String,

        val houses: Set<House> = setOf(),

        val excludeHouses: Set<House> = setOf(),

        val title: String = "",

        val forSale: Boolean? = null,
        val forTrade: Boolean = false,
        val forAuction: Boolean = false,
        val forSaleInCountry: Country? = null,

        val expansions: List<Int> = listOf(),

        val constraints: List<Constraint> = listOf(),

        val cards: List<DeckCardQuantity> = listOf(),

        val owner: String = "",

        val userId: UUID,

        val id: Long?
) {
    fun toDeckFilters() = DeckFilters(
            houses = houses,
            excludeHouses = excludeHouses,
            title = title,
            forSale = forSale,
            forTrade = forTrade,
            forAuction = forAuction,
            forSaleInCountry = forSaleInCountry,
            expansions = expansions,
            constraints = constraints,
            cards = cards,
            owner = owner,
    )
}

@Entity
data class SaleNotificationConstraint(

        val property: String,
        val cap: Cap,
        val value: Int,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

@Entity
data class SaleNotificationDeckCardQuantity(

        @ElementCollection
        val cardNames: List<String>,
        val quantity: Int,
        val house: House? = null,
        val mav: Boolean? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        val id: Long = -1
)

