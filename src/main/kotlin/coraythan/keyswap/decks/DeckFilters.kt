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
    val notesUser: String
    val tags: List<Long>
    val notTags: List<Long>
    val tokens: List<String>

    val titleQl: Boolean
    val notForSale: Boolean
    val forSale: Boolean?
    val forTrade: Boolean
    val forSaleInCountry: Country?
    val myFavorites: Boolean
    val expansions: List<Int>
    val withOwners: Boolean
    val teamDecks: Boolean

    val constraints: List<Constraint>
    val cards: List<DeckCardQuantity>

    val owner: String
    val owners: List<String>
    val previousOwner: String

    val tournamentIds: List<Long>
}

data class DeckFilters(
    override val houses: Set<House> = setOf(),
    override val excludeHouses: Set<House> = setOf(),
    override val title: String = "",
    override val notes: String = "",
    override val notesUser: String = "",
    override val tags: List<Long> = listOf(),
    override val notTags: List<Long> = listOf(),
    override val tokens: List<String> = listOf(),

    val page: Long = 0,

    override val titleQl: Boolean = false,
    override val notForSale: Boolean = false,
    override val forSale: Boolean? = null,
    override val forTrade: Boolean = false,
    override val forSaleInCountry: Country? = null,
    override val myFavorites: Boolean = false,
    override val expansions: List<Int> = listOf(),
    override val withOwners: Boolean = false,
    override val teamDecks: Boolean = false,

    override val constraints: List<Constraint> = listOf(),

    override val cards: List<DeckCardQuantity> = listOf(),

    override val owner: String = "",
    override val owners: List<String> = listOf(),
    override val previousOwner: String = "",
    override val tournamentIds: List<Long> = listOf(),

    val pageSize: Long = 20,

    val sort: DeckSortOptions = DeckSortOptions.SAS_RATING,
    val sortDirection: SortDirection = SortDirection.DESC
) : DeckQuery {
    fun clean() = if (this.pageSize < 20) this.copy(pageSize = 20) else this
}

@GenerateTs
data class DeckCardQuantity(
        val cardNames: List<String>,
        val quantity: Int,
        val house: House? = null,
        val mav: Boolean? = null
)

@GenerateTs
enum class DeckSortOptions {
    ADDED_DATE,
    SAS_RATING,
}

@GenerateTs
enum class SortDirection(val direction: Sort.Direction) {
    ASC(Sort.Direction.ASC),
    DESC(Sort.Direction.DESC)
}

@GenerateTs
data class Constraint(
        val property: String,
        val cap: Cap,
        val value: Double
)

@GenerateTs
enum class Cap {
    MIN,
    MAX,
    EQUALS
}
