package coraythan.keyswap.userdeck

import coraythan.keyswap.Api
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/userdeck/secured")
class UserDeckEndpoints(
        val userDeckService: UserDeckService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/{id}/wishlist")
    fun wishlist(@PathVariable id: Long) = userDeckService.addToWishlist(id)

    @PostMapping("/{id}/unwishlist")
    fun unwishlist(@PathVariable id: Long) = userDeckService.addToWishlist(id, false)

    @PostMapping("/{id}/funny")
    fun funny(@PathVariable id: Long) = userDeckService.markAsFunny(id)

    @PostMapping("/{id}/unfunny")
    fun unfunny(@PathVariable id: Long) = userDeckService.markAsFunny(id, false)

    @PostMapping("/{id}/owned")
    fun owned(@PathVariable id: Long) = userDeckService.markAsOwned(id)

    @PostMapping("/{id}/unowned")
    fun unowned(@PathVariable id: Long) = userDeckService.markAsOwned(id, false)

    @GetMapping("/for-user")
    fun findAllForUser() = userDeckService.findAllForUser()

    @PostMapping("/{id}/notes")
    fun notes(@PathVariable id: Long, @RequestBody notes: Notes) = userDeckService.updateNotes(id, notes.notes)

}

data class Notes(val notes: String)
