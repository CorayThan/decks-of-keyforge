package coraythan.keyswap.users

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*

const val users = "users"

/**
 * Spring automatically sets up the /login endpoint.
 */
@RestController
@RequestMapping("${Api.base}/$users")
class UserEndpoints(
        private val userService: KeyUserService,
        private val currentUserService: CurrentUserService
) {

    @GetMapping("/secured/your-user")
    fun findYourUser() = currentUserService.loggedInUser()

    @PostMapping("/register")
    fun register(@RequestBody user: UserRegistration) {
        userService.register(user)
    }

    @GetMapping("/{username}")
    fun findUserProfile(@PathVariable username: String) = userService.findUserProfile(username)

    @PostMapping("/secured/update")
    fun updateProfile(@RequestBody userProfile: UserProfileUpdate) = userService.updateUserProfile(userProfile)

    @PostMapping("/send-reset")
    fun sendReset(@RequestBody reset: ResetEmail) = userService.sendReset(reset)

    @PostMapping("/change-password")
    fun changePassword(@RequestBody request: ResetPasswordRequest) = userService.resetPasswordTo(request.resetCode, request.newPassword)
}
