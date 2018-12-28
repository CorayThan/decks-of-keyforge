package coraythan.keyswap.userdeck

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/userdeck")
class UserDeckEndpoints(
        val userDeckService: UserDeckService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/{id}/wishlist")
    fun wishlist(@PathVariable id: Long) = userDeckService.addToWishlist(id)

    @PostMapping("/{id}/unwishlist")
    fun unwishlist(@PathVariable id: Long) = userDeckService.removeFromWishlist(id)
}
