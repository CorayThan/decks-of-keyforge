package coraythan.keyswap.users

import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
@Transactional
class KeyUserService(
        private val userRepo: KeyUserRepo,
        private val currentUserService: CurrentUserService,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder,
        private val passwordResetCodeService: PasswordResetCodeService
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
                allowUsersToSeeDeckOwnership = userRegInfo.allowUsersToSeeDeckOwnership,
                lastVersionSeen = userRegInfo.lastVersionSeen
        ))
    }

    fun userFromEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun findByIdOrNull(id: UUID) = userRepo.findByIdOrNull(id)
    fun findUserProfile(username: String) =
            userRepo.findByUsernameIgnoreCase(username)?.toProfile(currentUserService.loggedInUser()?.username == username)

    fun findUserByUsername(username: String) = userRepo.findByUsernameIgnoreCase(username)

    fun findByEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun updateUserProfile(update: UserProfileUpdate) {
        val user = currentUserService.loggedInUser()
        if (user != null) {
            val userDecks = if (update.country != user.country) {
                user.decks.map {
                    if (it.forSale || it.forTrade) it.copy(forSaleInCountry = update.country) else it
                }
            } else {
                user.decks
            }

            userRepo.save(user.copy(
                    publicContactInfo = update.publicContactInfo,
                    allowUsersToSeeDeckOwnership = update.allowUsersToSeeDeckOwnership,
                    country = update.country,
                    preferredCountries = if (update.preferredCountries.isNullOrEmpty()) null else update.preferredCountries,
                    decks = userDecks
            ))
        }
    }

    fun resetPasswordTo(code: String, newPassword: String) {

        check(newPassword.length > 7) {
            "Password is too short."
        }

        val emailToResetFor = passwordResetCodeService.resetCodeEmail(code) ?: throw IllegalArgumentException("No email for this code or expired.")
        val userAccount = userRepo.findByEmailIgnoreCase(emailToResetFor) ?: throw IllegalStateException("No account found with email $emailToResetFor")
        val withPassword = userAccount.copy(password = bCryptPasswordEncoder.encode(newPassword))
        userRepo.save(withPassword)
        passwordResetCodeService.delete(code)
    }

    fun updateLatestUserVersion(version: String) {
        val user = currentUserService.loggedInUser()
        if (user != null) {
            userRepo.save(user.copy(lastVersionSeen = version))
        }
    }
}
