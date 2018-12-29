package coraythan.keyswap.decks

import coraythan.keyswap.House
import org.springframework.data.domain.Sort

data class DeckFilters(
        val houses: Set<House> = setOf(),
        val title: String = "",

        val page: Int = 1,

        val forSale: Boolean = false,
        val forTrade: Boolean = false,
        val containsMaverick: Boolean = false,

        val sort: DeckSortOptions = DeckSortOptions.ADDED_DATE,
        val sortDirection: SortDirection = SortDirection.ASC
)

enum class DeckSortOptions {
    ADDED_DATE,
    DECK_NAME,
    AMBER,
    POWER,
    CREATURES,
    MAVERICK_COUNT,
    RARES,
    UNCOMMONS,
    SPECIALS
}

enum class SortDirection(val direction: Sort.Direction) {
    ASC(Sort.Direction.ASC),
    DESC(Sort.Direction.DESC)
}
