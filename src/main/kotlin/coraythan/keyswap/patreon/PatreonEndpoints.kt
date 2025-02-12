package coraythan.keyswap.patreon

import coraythan.keyswap.Api
import coraythan.keyswap.security.SecretApiKeyValidator
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/patreon")
class PatreonEndpoints(
        private val patreonService: PatreonService,
        val apiKeys: SecretApiKeyValidator
) {

    @PostMapping("/secured/refresh-primary/{token}")
    fun refreshPrimary(@PathVariable token: String) = patreonService.refreshCreatorAccountManually(token)

    @PostMapping("/secured/link/{code}")
    fun linkAccount(@PathVariable code: String) = patreonService.linkAccount(code)

    @PostMapping("/secured/unlink")
    fun unlinkAccount() = patreonService.unlinkAccount()

    @GetMapping("/top-patrons")
    fun topPatrons() = patreonService.topPatrons()

    @PostMapping("/update-refresh-token/{apiKey}/{token}")
    fun resetCreatorAccount(@PathVariable token: String, @PathVariable apiKey: String) {
        apiKeys.checkApiKey(apiKey)
        patreonService.updateCreatorAccount(token)
    }
}
