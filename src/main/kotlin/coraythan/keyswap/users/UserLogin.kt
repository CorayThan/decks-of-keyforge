package coraythan.keyswap.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
@JsonIgnoreProperties(ignoreUnknown = true)
data class UserLogin(
        val email: String,
        val password: String
)
