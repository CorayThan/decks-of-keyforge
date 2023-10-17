package coraythan.keyswap.patreon

import com.patreon.PatreonOAuth
import coraythan.keyswap.now
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.time.ZonedDateTime
import java.util.*

@Entity
data class PatreonAccount(
        val accessToken: String,
        val refreshToken: String,
        val scope: String,
        val tokenType: String,
        val refreshedAt: ZonedDateTime = now(),

        @Id
        val id: UUID = UUID.randomUUID()
) {
    companion object {
        fun fromToken(token: PatreonOAuth.TokensResponse) = PatreonAccount(
                accessToken = token.accessToken,
                refreshToken = token.refreshToken,
                scope = token.scope,
                tokenType = token.tokenType
        )
    }
}
