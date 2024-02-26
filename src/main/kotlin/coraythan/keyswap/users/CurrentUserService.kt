package coraythan.keyswap.users

import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.patreon.levelAtLeast
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class CurrentUserService(
    private val userRepo: KeyUserRepo,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun loggedInUser(): KeyUser? {
        val authentication = SecurityContextHolder.getContext().authentication
        val userEmail = authentication?.principal as String? ?: return null
        return userRepo.findByEmail(userEmail)
    }

    fun loggedInUserOrUnauthorized() = loggedInUser() ?: throw UnauthorizedException("Unauthorized")
    fun loggedInContentCreatorOrUnauthorized(): KeyUser {
        val user = loggedInUser()?: throw UnauthorizedException("Unauthorized")
        if (user.type != UserType.ADMIN && user.type != UserType.CONTENT_CREATOR) throw UnauthorizedException("Must be content creator.")
        return user
    }

    fun loggedInUserDto(): KeyUserDto? {
        val userDto = loggedInUser()?.toDto()
        return userDto
    }

    fun contentCreator(): Boolean {
        val userType = loggedInUser()?.type
//        log.info("User type is $userType")
        return userType == UserType.ADMIN || userType == UserType.CONTENT_CREATOR
    }

    fun hasPatronLevelOrUnauthorized(tier: PatreonRewardsTier): KeyUser {
        val user = loggedInUserOrUnauthorized()
        check(user.realPatreonTier()?.levelAtLeast(tier) == true) {
            throw UnauthorizedException("Insufficient patreon tier.")
        }
        return user
    }

    fun hasContributed() {
        check(loggedInUser()?.contributedOrManual() == true) {
            throw UnauthorizedException("Must have contributed to Patreon.")
        }
    }

    fun contentCreatorOrUnauthorized() {
        if (!contentCreator()) throw UnauthorizedException("Unauthorized")
    }

    fun adminOrUnauthorized() {
        val userType = loggedInUser()?.type
        if (userType != UserType.ADMIN) throw UnauthorizedException("Unauthorized")
    }

    fun passwordMatches(password: String) {
        log.info("Password: $password")
        val user = loggedInUserOrUnauthorized()
        if (!bCryptPasswordEncoder.matches(password, user.password)) throw UnauthorizedException("Incorrect password")
    }
}
