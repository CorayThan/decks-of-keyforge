package coraythan.keyswap.users.search

data class UserSearchResults(
        val updatedMinutesAgo: Long,
        val users: List<UserSearchResult>
)
