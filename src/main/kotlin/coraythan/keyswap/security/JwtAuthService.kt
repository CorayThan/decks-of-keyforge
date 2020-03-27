package coraythan.keyswap.security

import coraythan.keyswap.TimeUtils
import coraythan.keyswap.now
import coraythan.keyswap.users.UserType
import io.jsonwebtoken.Claims
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Service
class JwtAuthService(
        @Value("\${jwt-secret}")
        private val jwtSecret: String
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    private val jwtParser = Jwts.parserBuilder()
            .setSigningKey(jwtSecret.toByteArray())
            .build()
    private val jwtSigningKey = Keys.hmacShaKeyFor(jwtSecret.toByteArray())

    companion object {
        private val EXPIRE_AFTER: Duration = Duration.ofDays(7)
        private val REFRESH_AFTER: Duration = Duration.ofHours(1)
        private const val TOKEN_PREFIX = "Bearer "
        private const val HEADER_STRING = "Authorization"
        private const val ROLE = "Role"
    }

    fun hasJwtAuthHeader(req: HttpServletRequest): Boolean {
        val header = req.getHeader(HEADER_STRING)
        return header != null && header.startsWith(TOKEN_PREFIX)
    }

    fun expiration(duration: Duration): Date = Date.from(now().plus(duration).toInstant())

    fun addJwtToResponse(
            res: HttpServletResponse, username: String,
            authorities: Collection<GrantedAuthority>?
    ) {

        val tokenBuilder = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(TimeUtils.nowAsDate())

        if (authorities == null || authorities.isEmpty()) throw RuntimeException("No authorities available!")

        val role = authorities.iterator().next()
        val date = expiration(EXPIRE_AFTER)

        tokenBuilder.setExpiration(date)
                .signWith(jwtSigningKey)
                .claim(ROLE, role)

        val token = tokenBuilder.compact()
        res.addHeader(HEADER_STRING, TOKEN_PREFIX + token)
    }

    fun getAuthenticationFromJwt(
            req: HttpServletRequest,
            res: HttpServletResponse
    ): UsernamePasswordAuthenticationToken? {

        val token = req.getHeader(HEADER_STRING)
        if (token != null) {
            try {
                val body: Claims = jwtParser
                        .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                        .body

                val userType = UserType.valueOf(body.get(ROLE, String::class.java))

                if (refreshToken(body)) {
                    addJwtToResponse(res, body.subject, userType.authoritiesList)
                }

                return UsernamePasswordAuthenticationToken(body.subject, null, userType.authoritiesList)

            } catch (expired: ExpiredJwtException) {
                log.debug("jwt expired")
                return null
            }
        }
        return null
    }

    fun refreshToken(authClaims: Claims): Boolean {
        val issuedAt = ZonedDateTime.ofInstant(authClaims.issuedAt.toInstant(), ZoneId.systemDefault())
        val expiresAt = ZonedDateTime.ofInstant(authClaims.expiration.toInstant(), ZoneId.systemDefault())
        val now = now()
        return now.isAfter(issuedAt.plus(REFRESH_AFTER)) && !expiresAt.isBefore(now)
    }
}
