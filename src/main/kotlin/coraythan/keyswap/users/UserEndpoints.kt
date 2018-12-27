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
        private val userService: KeyUserService
) {

    @GetMapping("/your-user")
    fun findYourUser() = userService.loggedInUser()

    @PostMapping("/public/register")
    fun register(@RequestBody user: UserRegistration) {
        userService.register(user)
    }

}
