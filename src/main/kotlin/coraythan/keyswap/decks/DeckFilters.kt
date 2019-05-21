package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.generic.Country
import org.springframework.data.domain.Sort

interface DeckQuery {
    val houses: Set<House>
    val title: String

    val notForSale: Boolean
    val forSale: Boolean
    val forTrade: Boolean
    val forAuction: Boolean
    val completedAuctions: Boolean
    val forSaleInCountry: Country?
    val includeUnregistered: Boolean
    val myFavorites: Boolean
    val expansions: List<Int>

    val constraints: List<Constraint>
    val cards: List<DeckCardQuantity>

    val owner: String
}

data class DeckFilters(
        override val houses: Set<House> = setOf(),
        override val title: String = "",

        val page: Long = 0,

        override val notForSale: Boolean = false,
        override val forSale: Boolean = false,
        override val forTrade: Boolean = false,
        override val forAuction: Boolean = false,
        override val completedAuctions: Boolean = false,
        override val forSaleInCountry: Country? = null,
        override val includeUnregistered: Boolean = false,
        override val myFavorites: Boolean = false,
        override val expansions: List<Int> = listOf(),

        override val constraints: List<Constraint> = listOf(),

        override val cards: List<DeckCardQuantity> = listOf(),

        override val owner: String = "",
        val pageSize: Long = 20,

        val sort: DeckSortOptions = DeckSortOptions.SAS_RATING,
        val sortDirection: SortDirection = SortDirection.DESC
) : DeckQuery {
    fun clean() = if (this.pageSize < 20) this.copy(pageSize = 20) else this
}

data class DeckCardQuantity(
        val cardName: String,
        val quantity: Int
)

enum class DeckSortOptions {
    ADDED_DATE,
    SAS_RATING,
    CARDS_RATING,
    AERC_SCORE,
    CHAINS,
    FUNNIEST,
    MOST_WISHLISTED,
    NAME,
    RECENTLY_LISTED,
    ENDING_SOONEST,
    COMPLETED_RECENTLY
}

enum class SortDirection(val direction: Sort.Direction) {
    ASC(Sort.Direction.ASC),
    DESC(Sort.Direction.DESC)
}

data class Constraint(
        val property: String,
        val cap: Cap,
        val value: Int
)

enum class Cap {
    MIN,
    MAX
}
