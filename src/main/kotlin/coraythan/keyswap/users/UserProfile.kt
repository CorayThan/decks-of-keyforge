package coraythan.keyswap.users

import java.util.*

data class UserProfile(
        val id: UUID,
        val username: String,
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean
)
