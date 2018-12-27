package coraythan.keyswap.users

data class UserRegistration(
        val username: String,
        val email: String,
        val password: String,
        val publicContactInfo: String?,
        val allowUsersToSeeDeckOwnership: Boolean
)
