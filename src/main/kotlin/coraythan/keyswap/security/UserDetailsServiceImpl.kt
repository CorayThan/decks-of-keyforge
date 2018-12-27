package coraythan.keyswap.security

import coraythan.keyswap.users.KeyUserService
import org.slf4j.LoggerFactory
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(private val userService: KeyUserService) : UserDetailsService {

    private val log = LoggerFactory.getLogger(this::class.java)

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String): UserDetails {
        val applicationUser = userService.userFromEmail(username) ?: throw UsernameNotFoundException(username)
        log.debug("Loaded user ${applicationUser.username} by user name.")
        return User(
                applicationUser.email,
                applicationUser.password,
                true,
                true,
                true,
                true,
                applicationUser.type.authoritiesList
        )
    }
}
