package coraythan.keyswap.users

import coraythan.keyswap.generic.Country

data class UserRegistration(
        val username: String,
        val email: String,
        val password: String,
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean,
        val acceptsTrades: Boolean,
        val country: Country?,
        val lastVersionSeen: String
)
