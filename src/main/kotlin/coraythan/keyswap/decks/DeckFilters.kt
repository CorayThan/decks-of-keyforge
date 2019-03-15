package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.generic.Country
import org.springframework.data.domain.Sort


data class DeckFilters(
        val houses: Set<House> = setOf(),
        val title: String = "",

        val page: Long = 0,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val forSaleInCountry: Country? = null,
        val includeUnregistered: Boolean = false,
        val myFavorites: Boolean = false,

        val constraints: List<Constraint> = listOf(),

        val cards: List<DeckCardQuantity> = listOf(),

        val owner: String = "",
        val pageSize: Long = 20,

        val sort: DeckSortOptions = DeckSortOptions.SAS_RATING,
        val sortDirection: SortDirection = SortDirection.DESC
) {
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
    NAME
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
