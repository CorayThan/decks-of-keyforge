package coraythan.keyswap.users

import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.patreon.PatreonRewardsTier
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CurrentUserService(
        private val userRepo: KeyUserRepo
) {
    fun loggedInUser(): KeyUser? {
        val authentication = SecurityContextHolder.getContext().authentication
        val userEmail = authentication.principal as String? ?: return null
        return userRepo.findByEmail(userEmail)
    }

    fun loggedInUserOrUnauthorized() = loggedInUser() ?: throw UnauthorizedException("Unauthorized")

    fun loggedInUserDto(): KeyUserDto? {
        val userDto = loggedInUser()?.toDto()
        if (userDto?.username == "Zarathustra05") {
            return userDto.copy(patreonTier = PatreonRewardsTier.ALWAYS_GENEROUS)
        }
        return userDto
    }
}
