package coraythan.keyswap.users

import coraythan.keyswap.Api
import coraythan.keyswap.patreon.PatreonRewardsTier
import coraythan.keyswap.security.SecretApiKeyValidator
import org.springframework.web.bind.annotation.*

const val users = "users"

/**
 * Spring automatically sets up the /login endpoint.
 */
@RestController
@RequestMapping("${Api.base}/$users")
class UserEndpoints(
        private val userService: KeyUserService,
        private val currentUserService: CurrentUserService,
        val apiKeys: SecretApiKeyValidator
) {

    @GetMapping("/secured/your-user")
    fun findYourUser() = currentUserService.loggedInUserDto()

    @PostMapping("/register")
    fun register(@RequestBody user: UserRegistration) = userService.register(user)

    @GetMapping("/{username}")
    fun findUserProfile(@PathVariable username: String) = userService.findUserProfile(username)

    @PostMapping("/secured/update")
    fun updateProfile(@RequestBody userProfile: UserProfileUpdate) = userService.updateUserProfile(userProfile)

    @PostMapping("/secured/version/{version}")
    fun updateLatestVersion(@PathVariable version: String) = userService.updateLatestUserVersion(version)

    @PostMapping("/change-password")
    fun changePassword(@RequestBody request: ResetPasswordRequest) = userService.resetPasswordTo(request.resetCode, request.newPassword)

    @PostMapping("/update-tier/{username}/{tier}")
    fun updatePatreonTier(@PathVariable username: String, @PathVariable tier: PatreonRewardsTier, @RequestParam apiKey: String) {
        apiKeys.checkApiKey(apiKey)
        userService.setContributionLevel(username, tier)
    }
}
