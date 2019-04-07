package coraythan.keyswap.patreon

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/patreon")
class PatreonEndpoints(
        private val patreonService: PatreonService
) {

    @PostMapping("/secured/link/{code}")
    fun linkAccount(@PathVariable code: String) = patreonService.linkAccount(code)

    @PostMapping("/secured/unlink")
    fun unlinkAccount() = patreonService.unlinkAccount()

    @GetMapping("/top-patrons")
    fun topPatrons() = patreonService.topPatrons()

}
