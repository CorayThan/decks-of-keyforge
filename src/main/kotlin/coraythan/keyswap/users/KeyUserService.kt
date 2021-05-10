package coraythan.keyswap.users

import coraythan.keyswap.auctions.DeckListingRepo
import coraythan.keyswap.auctions.DeckListingStatus
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.SchedulingConfig
import coraythan.keyswap.decks.DeckRepo
import coraythan.keyswap.generic.Country
import coraythan.keyswap.now
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.scheduledException
import coraythan.keyswap.userdeck.OwnedDeckRepo
import coraythan.keyswap.users.search.UserSearchResult
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

const val lockRemoveManualPatrons = "PT24H"

@Service
@Transactional
class KeyUserService(
        private val userRepo: KeyUserRepo,
        private val currentUserService: CurrentUserService,
        private val bCryptPasswordEncoder: BCryptPasswordEncoder,
        private val passwordResetCodeService: PasswordResetCodeService,
        private val deckListingRepo: DeckListingRepo,
        private val ownedDeckRepo: OwnedDeckRepo,
        private val deckRepo: DeckRepo,
        private val keyUserSearchProjectionRepo: KeyUserSearchProjectionRepo,
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    companion object {
        val termsVersion = 1
        val usernameRegexBase = "(\\d|\\w|-|_)+"
        val usernameRegex = usernameRegexBase.toRegex()
    }

    @Scheduled(fixedDelayString = lockRemoveManualPatrons, initialDelayString = SchedulingConfig.removeManualPatronsInitialDelay)
    @SchedulerLock(name = "removeManualPatrons", lockAtLeastFor = lockRemoveManualPatrons, lockAtMostFor = lockRemoveManualPatrons)
    fun removeManualPatrons() {
        try {
            userRepo.findByRemoveManualPatreonTierNotNull()
                    .forEach {
                        if (it.removeManualPatreonTier?.isBefore(now()) == true) {
                            log.info("Removing manual patron tier ${it.manualPatreonTier} from ${it.username}")
                            userRepo.makeManualPatronExpiring(null, null, it.username)
                        }
                    }
        } catch (e: Throwable) {
            log.error("$scheduledException removing manual patrons", e)
        }
    }

    fun register(userRegInfo: UserRegistration): KeyUser {

        check(userRegInfo.password.length > 7) {
            "Password is too short."
        }
        validateEmail(userRegInfo.email)

        validateUsername(userRegInfo.username)

        return userRepo.save(KeyUser(
                id = UUID.randomUUID(),
                username = userRegInfo.username,
                email = userRegInfo.email.lowercase(),
                password = bCryptPasswordEncoder.encode(userRegInfo.password),
                type = UserType.USER,
                publicContactInfo = if (userRegInfo.publicContactInfo.isNullOrBlank()) null else userRegInfo.publicContactInfo,
                allowUsersToSeeDeckOwnership = userRegInfo.allowUsersToSeeDeckOwnership,
                allowsTrades = userRegInfo.acceptsTrades,
                lastVersionSeen = userRegInfo.lastVersionSeen,
                currencySymbol = "$",
                country = userRegInfo.country
        ))
    }

    fun userFromEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun findByIdOrNull(id: UUID) = userRepo.findByIdOrNull(id)
    fun findUserProfile(username: String): UserProfile? {
        val user = userRepo.findByUsernameIgnoreCase(username) ?: return null
        val ownedDecks = ownedDeckRepo.findAllByOwnerId(user.id).map { it.deck }
        return user.toProfile(currentUserService.loggedInUser()?.username == username, ownedDecks)
    }

    fun findUserByUsername(username: String) = userRepo.findByUsernameIgnoreCase(username)

    fun findIdAndDeckVisibilityByUsername(username: String) = keyUserSearchProjectionRepo.findByUsernameIgnoreCase(username)

    fun findByEmail(email: String) = userRepo.findByEmailIgnoreCase(email)

    fun agreeToTerms() {
        val user = currentUserService.loggedInUserOrUnauthorized()
        userRepo.setAgreedToTerms(user.id)
    }

    fun updateUserProfile(update: UserProfileUpdate) {
        val user = currentUserService.loggedInUserOrUnauthorized()
        val userAllowsTrades = user.allowsTrades
        var auctions = user.auctions

        if (update.currencySymbol != user.currencySymbol && deckListingRepo.findAllBySellerIdAndStatus(user.id, DeckListingStatus.AUCTION).isNotEmpty()) {
            throw BadRequestException("You cannot update your currency symbol while you have active auctions.")
        }

        if (update.country != user.country || update.currencySymbol != user.currencySymbol) {
            auctions = user.auctions.map {
                it.copy(forSaleInCountry = update.country ?: Country.UnitedStates, currencySymbol = update.currencySymbol)
            }
        }

        if (update.email != null) validateEmail(update.email)

        val email = update.email?.lowercase() ?: user.email
        val sellerEmail = update.sellerEmail?.lowercase() ?: user.sellerEmail
        val alreadyVerifiedEmail = if (user.emailVerified) user.email.lowercase() else null
        val alreadyVerifiedEmail2 = if (user.sellerEmailVerified) user.sellerEmail?.lowercase() else null
        val emailVerified = if (email == alreadyVerifiedEmail || email == alreadyVerifiedEmail2) true else if (update.email == null) user.emailVerified else false
        val sellerEmailVerified = if (sellerEmail != null && (sellerEmail == alreadyVerifiedEmail || sellerEmail == alreadyVerifiedEmail2)) {
            true
        } else if (update.sellerEmail == null) {
            user.sellerEmailVerified
        } else {
            false
        }

        userRepo.save(user.copy(
                email = email,
                emailVerified = emailVerified,
                publicContactInfo = update.publicContactInfo,
                allowsTrades = update.allowsTrades,
                allowUsersToSeeDeckOwnership = update.allowUsersToSeeDeckOwnership,
                currencySymbol = update.currencySymbol,
                country = update.country,
                preferredCountries = if (update.preferredCountries.isNullOrEmpty()) null else update.preferredCountries,
                auctions = auctions,
                sellerEmail = sellerEmail,
                sellerEmailVerified = sellerEmailVerified,
                discord = update.discord,
                tcoUsername = update.tcoUsername,
                storeName = update.storeName,
                shippingCost = update.shippingCost,
                autoRenewListings = update.autoRenewListings,
                viewFutureSas = update.viewFutureSas,
        ))

        if (userAllowsTrades != update.allowsTrades) {
            val activeListings = deckListingRepo.findAllBySellerIdAndStatus(user.id, DeckListingStatus.SALE)
            activeListings.forEach {
                deckListingRepo.save(it.copy(forTrade = update.allowsTrades))
                deckRepo.save(it.deck.copy(forTrade = update.allowsTrades))
            }
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

    fun changeUsername(password: String, username: String) {

        val user = currentUserService.loggedInUserOrUnauthorized()
        currentUserService.passwordMatches(password)

        val trimmedUsername = username.trim()
        validateUsername(trimmedUsername)

        userRepo.save(user.copy(username = trimmedUsername))
    }

    fun updateLatestUserVersion(version: String) {
        val user = currentUserService.loggedInUser()
        if (user != null) {
            userRepo.save(user.copy(lastVersionSeen = version))
        }
    }

    fun setUserRole(username: String, role: UserType) {
        currentUserService.adminOrUnauthorized()
        if (role == UserType.ADMIN) throw IllegalArgumentException("No making admins!")
        userRepo.setUserType(role, username)
    }

    fun makeManualPatron(username: String, tier: PatreonRewardsTier?, expiresInDays: Long? = null) {
        currentUserService.adminOrUnauthorized()
        if (expiresInDays == null) {
            userRepo.makeManualPatron(tier, username)
        } else {
            userRepo.makeManualPatronExpiring(tier, now().plusDays(expiresInDays), username)
        }
    }

    fun setContributionLevel(username: String, patreonRewardsTier: PatreonRewardsTier) {
        val toUpdate = userRepo.findByUsernameIgnoreCase(username) ?: throw BadRequestException("No user for user name $username")
        userRepo.save(toUpdate.copy(patreonTier = patreonRewardsTier))
    }

    fun verifyEmail(code: String) {
        val codeInfo = passwordResetCodeService.passwordResetCodeByCode(code) ?: throw BadRequestException("We couldn't find the given code.")
        if (codeInfo.userId == null) {
            throw BadRequestException("Please use a fresh code.")
        }
        val user = userRepo.findByIdOrNull(codeInfo.userId) ?: throw BadRequestException("No user exists for the given code.")
        val email = codeInfo.email.lowercase()
        val userEmail = user.email.lowercase()
        val sellerEmail = user.sellerEmail?.lowercase()
        val verifyEmail = email == userEmail
        val verifySellerEmail = email == sellerEmail
        if (!verifyEmail && !verifySellerEmail) {
            throw BadRequestException("Your user does not have the email ${codeInfo.email}")
        }
        userRepo.save(user.copy(emailVerified = verifyEmail, sellerEmailVerified = verifySellerEmail))
    }

    private fun validateEmail(email: String) {
        check(email.isNotBlank()) {
            "Email is blank."
        }
        check(userRepo.findByEmailIgnoreCase(email) == null) {
            log.info("$email email is already taken.")
            "This email is already taken."
        }
    }

    private fun validateUsername(username: String) {
        check(username.isNotBlank()) {
            "Username is blank."
        }

        check(username.matches(usernameRegex)) {
            "Username is malformed: ${username}"
        }

        check(userRepo.findByUsernameIgnoreCase(username) == null) {
            log.info("${username} username is already taken.")
            "This username is already taken."
        }
    }

    fun findUsersByUsername(name: String): List<UserSearchResult> {
        return userRepo.findByUsernameContainsIgnoreCase(name.trim()).map {
            it.minimalSearchResult()
        }
                .sortedBy { it.username.lowercase() }
                .take(10)
    }
}
