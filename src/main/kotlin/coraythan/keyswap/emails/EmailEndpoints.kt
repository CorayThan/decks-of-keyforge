package coraythan.keyswap.emails

import coraythan.keyswap.Api
import coraythan.keyswap.users.ResetEmail
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("${Api.base}/emails")
class EmailEndpoints(
        val emailService: EmailService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    @PostMapping("/secured/seller-message")
    fun sellerMessage(@RequestBody sellerMessage: SellerMessage) = emailService.sendMessageToSeller(sellerMessage)

    @PostMapping("/secured/offer-message/{offerId}")
    fun sellerMessage(@PathVariable offerId: UUID, @RequestBody message: Message) = emailService.sendOfferMessage(offerId, message.message)

    @PostMapping("/send-reset")
    fun sendReset(@RequestBody reset: ResetEmail) = emailService.sendResetPassword(reset)

    @PostMapping("/secured/send-email-verification")
    fun sendEmailVerification(@RequestBody verify: ResetEmail) = emailService.sendVerifyEmail(verify)
}

data class Message(val message: String)