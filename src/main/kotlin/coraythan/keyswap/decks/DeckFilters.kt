package coraythan.keyswap.decks

import coraythan.keyswap.House
import org.springframework.data.domain.Sort

data class DeckFilters(
        val houses: Set<House> = setOf(),
        val title: String = "",

        val page: Int = 1,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val myDecks: Boolean = false,

        val constraints: List<Constraint> = listOf(),

        val cards: List<DeckCardQuantity> = listOf(),

        val owner: String = "",

        val sort: DeckSortOptions = DeckSortOptions.ADDED_DATE,
        val sortDirection: SortDirection = SortDirection.ASC
)

data class DeckCardQuantity(
        val cardName: String,
        val quantity: Int
)

enum class DeckSortOptions {
    ADDED_DATE,
    SAS_RATING,
    CARDS_RATING,
    SYNERGY,
    ANTISYNERGY,
    EXPECTED_AMBER,
    FUNNIEST,
    MOST_WISHLISTED,
    TOTAL_CREATURE_POWER,
    CREATURE_COUNT,
    MAVERICK_COUNT,
    RARES,
    SPECIALS,
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
