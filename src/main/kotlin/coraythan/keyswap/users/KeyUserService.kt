package coraythan.keyswap.users

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.patreon.PatreonRewardsTier
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
        validateEmail(userRegInfo.email)
        check(userRegInfo.username.isNotBlank()) {
            "Username is blank."
        }

        check(userRegInfo.username.matches(usernameRegex)) {
            "Username is malformed: ${userRegInfo.username}"
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
        val user = currentUserService.loggedInUserOrUnauthorized()
        val userDecks = if (update.country != user.country) {
            user.decks.map {
                if (it.forSale || it.forTrade) it.copy(forSaleInCountry = update.country) else it
            }
        } else {
            user.decks
        }

        if (update.email != null) validateEmail(update.email)

        userRepo.save(user.copy(
                email = update.email ?: user.email,
                publicContactInfo = update.publicContactInfo,
                allowUsersToSeeDeckOwnership = update.allowUsersToSeeDeckOwnership,
                country = update.country,
                preferredCountries = if (update.preferredCountries.isNullOrEmpty()) null else update.preferredCountries,
                decks = userDecks,
                sellerEmail = update.sellerEmail,
                discord = update.discord,
                storeName = update.storeName
        ))
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

    fun setContributionLevel(username: String, patreonRewardsTier: PatreonRewardsTier) {
        val toUpdate = userRepo.findByUsernameIgnoreCase(username) ?: throw BadRequestException("No user for user name $username")
        userRepo.save(toUpdate.copy(patreonTier = patreonRewardsTier))
    }

    private fun validateEmail(email: String) {
        check(email.isNotBlank()) {
            "Email is blank."
        }
        check(userRepo.findByEmailIgnoreCase(email) == null) {
            log.info("${email} email is already taken.")
            "This email is already taken."
        }
    }
}
