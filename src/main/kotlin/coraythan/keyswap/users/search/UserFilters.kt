package coraythan.keyswap.users.search

data class UserFilters(

        val favorites: Boolean = false,
        val friends: Boolean = false,
        val sort: UserSort = UserSort.DECK_COUNT,
        val username: String = ""
)

enum class UserSort {
    USER_NAME,
    DECK_COUNT,
    PATRON_LEVEL,
    SAS_AVERAGE,
    TOP_SAS,
    LOW_SAS,
    TOTAL_POWER,
    TOTAL_CHAINS,
    FOR_SALE_COUNT
}