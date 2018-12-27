package coraythan.keyswap.security

import com.fasterxml.jackson.databind.ObjectMapper
import coraythan.keyswap.Api
import coraythan.keyswap.users.UserLogin
import coraythan.keyswap.users.users
import org.slf4j.LoggerFactory
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import java.io.IOException
import java.util.*
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


class AuthenticationFilter(
        authMan: AuthenticationManager,
        private val jwtAuthService: JwtAuthService
) : UsernamePasswordAuthenticationFilter() {

    private val log = LoggerFactory.getLogger(this::class.java)

    companion object {
        private val objectMapper = ObjectMapper().findAndRegisterModules()
    }

    init {
        this.authenticationManager = authMan
        this.setFilterProcessesUrl("${Api.base}/$users/login")
    }

    @Throws(exceptionClasses = [AuthenticationException::class, DisabledException::class])
    override fun attemptAuthentication(req: HttpServletRequest, res: HttpServletResponse): Authentication {
        try {
            val credentials = objectMapper.readValue(req.inputStream, UserLogin::class.java)
            return authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken(
                            credentials.email,
                            credentials.password,
                            ArrayList<GrantedAuthority>())
            )
        } catch (e: IOException) {
            throw RuntimeException(e)
        }
    }

    @Throws(IOException::class, ServletException::class)
    override fun successfulAuthentication(
            req: HttpServletRequest,
            res: HttpServletResponse,
            chain: FilterChain,
            auth: Authentication
    ) {
        val user = (auth.principal as User)
        jwtAuthService.addJwtToResponse(res, user.username, user.authorities)
    }

    override fun unsuccessfulAuthentication(request: HttpServletRequest, response: HttpServletResponse, failed: AuthenticationException) {
        if (failed is DisabledException) {
            log.warn("An account is disabled for request $request.")
            response.sendError(480)
        } else {
            super.unsuccessfulAuthentication(request, response, failed)
        }
    }
}
