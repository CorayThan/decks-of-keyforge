package coraythan.keyswap.alliancedecks

import coraythan.keyswap.House
import coraythan.keyswap.decks.SortDirection
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class AllianceDeckFilters(
    val houses: Set<House> = setOf(),
    val excludeHouses: Set<House> = setOf(),
    val title: String = "",

    val page: Long = 0,

    val expansions: List<Int> = listOf(),
    val teamDecks: Boolean = false,
    val owners: List<String> = listOf(),

    val pageSize: Long = 20,
    val sort: AllianceDeckSortOptions = AllianceDeckSortOptions.SAS_RATING,
    val sortDirection: SortDirection = SortDirection.DESC
) {
    fun clean() = if (this.pageSize < 20) this.copy(pageSize = 20) else this
}

@GenerateTs
enum class AllianceDeckSortOptions {
    ADDED_DATE,
    SAS_RATING,
    NAME,
}
