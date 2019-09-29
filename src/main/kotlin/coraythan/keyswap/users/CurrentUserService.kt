package coraythan.keyswap.users

import coraythan.keyswap.config.UnauthorizedException
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CurrentUserService(
        private val userRepo: KeyUserRepo
) {
    private val log = LoggerFactory.getLogger(this::class.java)

    fun loggedInUser(): KeyUser? {
        val authentication = SecurityContextHolder.getContext().authentication
        val userEmail = authentication.principal as String? ?: return null
        return userRepo.findByEmail(userEmail)
    }

    fun loggedInUserOrUnauthorized() = loggedInUser() ?: throw UnauthorizedException("Unauthorized")

    fun loggedInUserDto(): KeyUserDto? {
        val userDto = loggedInUser()?.toDto()
        return userDto
    }

    fun contentCreatorOrUnauthorized() {
        val userType = loggedInUser()?.type
        log.info("User type is $userType")
        if (userType != UserType.ADMIN && userType != UserType.CONTENT_CREATOR) throw UnauthorizedException("Unauthorized")
    }

    fun adminOrUnauthorized() {
        val userType = loggedInUser()?.type
        if (userType != UserType.ADMIN) throw UnauthorizedException("Unauthorized")
    }
}
