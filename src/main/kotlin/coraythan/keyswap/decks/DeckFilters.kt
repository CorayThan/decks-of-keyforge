package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.generic.Country
import org.springframework.data.domain.Sort

interface DeckQuery {
    val houses: Set<House>
    val excludeHouses: Set<House>?
    val title: String
    val notes: String
    val notNotes: Boolean
    val notesUser: String

    val notForSale: Boolean
    val forSale: Boolean?
    val forTrade: Boolean
    val forAuction: Boolean
    val completedAuctions: Boolean
    val forSaleInCountry: Country?
    val myFavorites: Boolean
    val expansions: List<Int>
    val withOwners: Boolean
    val teamDecks: Boolean

    val constraints: List<Constraint>
    val cards: List<DeckCardQuantity>

    val owner: String
}

data class DeckFilters(
        override val houses: Set<House> = setOf(),
        override val excludeHouses: Set<House> = setOf(),
        override val title: String = "",
        override val notes: String = "",
        override val notNotes: Boolean = false,
        override val notesUser: String = "",

        val page: Long = 0,

        override val notForSale: Boolean = false,
        override val forSale: Boolean? = null,
        override val forTrade: Boolean = false,
        override val forAuction: Boolean = false,
        override val completedAuctions: Boolean = false,
        override val forSaleInCountry: Country? = null,
        override val myFavorites: Boolean = false,
        override val expansions: List<Int> = listOf(),
        override val withOwners: Boolean = false,
        override val teamDecks: Boolean = false,

        override val constraints: List<Constraint> = listOf(),

        override val cards: List<DeckCardQuantity> = listOf(),

        override val owner: String = "",
        val pageSize: Long = 20,

        val sort: DeckSortOptions = DeckSortOptions.SAS_RATING,
        val sortDirection: SortDirection = SortDirection.DESC
) : DeckQuery {
    fun clean() = if (this.pageSize < 20) this.copy(pageSize = 20) else this
}

@GenerateTs
data class  DeckCardQuantity(
        val cardNames: List<String>,
        val quantity: Int,
        val house: House? = null,
        val mav: Boolean? = null
)

enum class DeckSortOptions {
    ADDED_DATE,
    SAS_RATING,
    POWER_LEVEL,
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
    MAX,
    EQUALS
}
