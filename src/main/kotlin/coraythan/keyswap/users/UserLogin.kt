package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class UserLogin(
        val email: String,
        val password: String
)
