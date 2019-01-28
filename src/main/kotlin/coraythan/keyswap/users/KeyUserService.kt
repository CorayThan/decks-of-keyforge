package coraythan.keyswap.users

import org.slf4j.LoggerFactory
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class KeyUserService(
        private val userRepo: KeyUserRepo,
        private val currentUserService: CurrentUserService,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder
) {

    private val log = LoggerFactory.getLogger(this::class.java)
    private val usernameRegex = "(\\d|\\w|-|_)+".toRegex()

    fun register(userRegInfo: UserRegistration): KeyUser {

        check(userRegInfo.password.length > 7) {
            "Password is too short."
        }
        check(userRegInfo.email.isNotBlank()) {
            "Email is blank."
        }
        check(userRegInfo.username.isNotBlank()) {
            "Username is blank."
        }

        check(userRegInfo.username.matches(usernameRegex)) {
            "Username is malformed: ${userRegInfo.username}"
        }

        check(userRepo.findByEmailIgnoreCase(userRegInfo.email) == null) {
            log.info("${userRegInfo.email} email is already taken.")
            "This email is already taken."
        }

        check(userRepo.findByUsernameIgnoreCase(userRegInfo.username) == null) {
            log.info("${userRegInfo.username} username is already taken.")
            "This username is already taken."
        }

        return userRepo.save(KeyUser(
                id = UUID.randomUUID(),
                username = userRegInfo.username,
                email = userRegInfo.email,
                password = bCryptPasswordEncoder.encode(userRegInfo.password),
                type = UserType.USER,
                publicContactInfo = if (userRegInfo.publicContactInfo.isNullOrBlank()) null else userRegInfo.publicContactInfo,
                allowUsersToSeeDeckOwnership = userRegInfo.allowUsersToSeeDeckOwnership
        ))
    }

    fun userFromEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun findUser(id: UUID) = userRepo.getOne(id)
    fun findUserProfile(username: String) =
            userRepo.findByUsernameIgnoreCase(username)?.toProfile(currentUserService.loggedInUser()?.username == username)

    fun updateUserProfile(update: UserProfileUpdate) {
        val user = currentUserService.loggedInUser()
        if (user != null) {
            userRepo.save(user.copy(
                    publicContactInfo = update.publicContactInfo,
                    allowUsersToSeeDeckOwnership = update.allowUsersToSeeDeckOwnership
            ))
        }
    }

}
