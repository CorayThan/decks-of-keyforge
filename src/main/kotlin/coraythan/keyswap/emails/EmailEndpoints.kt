package coraythan.keyswap.emails

import coraythan.keyswap.Api
import coraythan.keyswap.users.ResetEmail
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${Api.base}/emails")
class EmailEndpoints(
        val emailService: EmailService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/seller-message")
    fun sellerMessage(@RequestBody sellerMessage: SellerMessage) = emailService.sendMessageToSeller(sellerMessage)

    @PostMapping("/send-reset")
    fun sendReset(@RequestBody reset: ResetEmail) = emailService.sendResetPassword(reset)

    @PostMapping("/send-email-verification")
    fun sendEmailVerification(@RequestBody verify: ResetEmail) = emailService.sendVerifyEmail(verify)
}
