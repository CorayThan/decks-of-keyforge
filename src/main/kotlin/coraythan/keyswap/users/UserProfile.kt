package coraythan.keyswap.users

import coraythan.keyswap.generic.Country
import java.util.*

data class UserProfile(
        val id: UUID,
        val username: String,
        val email: String?,
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean,
        val country: Country?,
        val lastVersionSeen: String?
)

data class UserProfileUpdate(
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean,
        val country: Country?
)
