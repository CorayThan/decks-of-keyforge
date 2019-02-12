package coraythan.keyswap.users

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
}
