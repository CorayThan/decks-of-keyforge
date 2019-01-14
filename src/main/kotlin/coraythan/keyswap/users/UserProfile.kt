package coraythan.keyswap.users

import java.util.*

data class UserProfile(
        val id: UUID,
        val username: String,
        val email: String?,
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean
)

data class UserProfileUpdate(
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean
)
