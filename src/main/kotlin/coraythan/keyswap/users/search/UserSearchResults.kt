package coraythan.keyswap.users.search

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class UserSearchResults(
        val updatedMinutesAgo: Long,
        val users: List<UserSearchResult>
)
