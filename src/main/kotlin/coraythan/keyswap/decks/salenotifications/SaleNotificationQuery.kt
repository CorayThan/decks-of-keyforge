package coraythan.keyswap.decks.salenotifications

import coraythan.keyswap.House
import coraythan.keyswap.decks.Cap
import coraythan.keyswap.decks.Constraint
import coraythan.keyswap.decks.DeckCardQuantity
import coraythan.keyswap.decks.DeckFilters
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import coraythan.keyswap.users.KeyUser
import io.hypersistence.utils.hibernate.type.array.ListArrayType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.util.*

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

        @Column(columnDefinition = "INT4")
        val forSaleInCountry: Country? = null,

        @ElementCollection
        val expansions: List<Int> = listOf(),

        @OneToMany(cascade = [CascadeType.ALL])
        val constraints: List<SaleNotificationConstraint> = listOf(),

        @OneToMany(cascade = [CascadeType.ALL])
        val cards: List<SaleNotificationDeckCardQuantity> = listOf(),

        @Type(ListArrayType::class)
        @Column(
                columnDefinition = "varchar[]"
        )
        val tokens: List<String>? = listOf(),

        val owner: String = "",

        @ManyToOne
        val user: KeyUser,

        val precedence: Int = 1000,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
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
                forSaleInCountry,
                expansions,
                constraints.map { Constraint(it.property, it.cap, it.value) },
                cards.map {
                    DeckCardQuantity(it.cardNames, it.quantity, it.house, it.mav)
                },
                tokens ?: listOf(),
                owner,
                user.id,
                precedence,
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
        val forSaleInCountry: Country? = null,

        val expansions: List<Int> = listOf(),

        val constraints: List<Constraint> = listOf(),

        val cards: List<DeckCardQuantity> = listOf(),
        val tokens: List<String> = listOf(),

        val owner: String = "",

        val userId: UUID,

        val precedence: Int,

        val id: Long?
) {
    fun toDeckFilters() = DeckFilters(
            houses = houses,
            excludeHouses = excludeHouses,
            title = title,
            forSale = forSale,
            forTrade = forTrade,
            forSaleInCountry = forSaleInCountry,
            expansions = expansions,
            constraints = constraints,
            cards = cards,
            tokens = tokens,
            owner = owner,
    )
}

@Entity
data class SaleNotificationConstraint(

        val property: String,
        @Column(columnDefinition = "INT4")
        val cap: Cap,
        val value: Double,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1
)

@Entity
data class SaleNotificationDeckCardQuantity(

        @ElementCollection
        val cardNames: List<String>,
        val quantity: Int,
        @Column(columnDefinition = "INT4")
        val house: House? = null,
        val mav: Boolean? = null,

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO, generator = "hibernate_sequence")
        @SequenceGenerator(name = "hibernate_sequence", allocationSize = 1)
        val id: Long = -1
)

