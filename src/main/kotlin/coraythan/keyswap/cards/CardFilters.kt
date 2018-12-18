package coraythan.keyswap.cards

import coraythan.keyswap.House
import org.springframework.data.domain.Sort

data class CardFilters(
        val includeMavericks: Boolean = false,
        val rarities: Set<Rarity> = setOf(),
        val types: Set<CardType> = setOf(),
        val houses: Set<House> = setOf(),
        val ambers: Set<Int> = setOf(),
        val powers: Set<Int> = setOf(),
        val armors: Set<Int> = setOf(),

        val title: String = "",
        val description: String = "",

        val sort: CardSortOptions = CardSortOptions.SET_NUMBER,
        val sortDirection: SortDirection = SortDirection.ASC
)

enum class CardSortOptions {
    SET_NUMBER,
    CARD_NAME,
    AMBER,
    POWER,
    ARMOR
}

enum class SortDirection(val direction: Sort.Direction) {
    ASC(Sort.Direction.ASC),
    DESC(Sort.Direction.DESC)
}
