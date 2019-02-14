package coraythan.keyswap.emails

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.users.KeyUserService
import coraythan.keyswap.users.PasswordResetCodeService
import coraythan.keyswap.users.ResetEmail
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import javax.mail.internet.InternetAddress

@Service
class EmailService(
        private val emailSender: JavaMailSender,
        private val keyUserService: KeyUserService,
        private val passwordResetCodeService: PasswordResetCodeService
) {

    fun sendResetPassword(reset: ResetEmail) {
        val userInSystem = keyUserService.findByEmail(reset.email)
        if (userInSystem != null) {
            val resetCode = passwordResetCodeService.createCode(reset.email)
            val resetEmailLink = makeLink("/reset-password/$resetCode")
            sendEmail(reset.email, "Reset your decksofkeyforge.com password",
                    """
                <div>
                    Use this link to reset your password. It will expire in 24 hours.
                    <a href="$resetEmailLink">$resetEmailLink</a>
                </div>
            """.trimIndent()
            )
        }
    }

    fun sendMessageToSeller(sellerMessage: SellerMessage) {

        val seller = keyUserService.findUserByUsername(sellerMessage.username)
                ?: throw BadRequestException("Couldn't find user with username $sellerMessage.username")
        val email = seller.email

        val senderUsername = sellerMessage.senderUsername
        val deckKeyforgeId = sellerMessage.deckKeyforgeId
        val deckName = sellerMessage.deckName
        val senderEmail = sellerMessage.senderEmail
        val message = sellerMessage.message

        sendEmail(email, "A deck you listed on Decks of Keyforge has a message",
            """
                <div>
                    <div>
                        $senderUsername has sent you a message about
                        <a href="${makeLink("/decks/$deckKeyforgeId")}">$deckName</a>, which you have listed for sale or trade on
                        <a href="${makeLink("")}">decksofkeyforge.com</a>.
                    </div>
                    <br>
                    <div>
                        We have not given $senderUsername your email address, but you can reply to their message at
                        <a href="mailto:$senderEmail">$senderEmail</a>
                    </div>
                    <br>
                    <b>$senderUsername's message</b>
                    <br>
                    <div style="white-space: pre-wrap; color: #444444;">$message</div>
                    <br>
                    <br>
                    <i>
                        To ensure it's possible to contact sellers about decks they've listed for sale or trade, we allow users to send you
                        an email through our service if the listing doesn't have an external link listed. We do not give them your email address.
                        If you would like to stop receiving emails like this, please provide an external link for your deck listings (like ebay,
                        your store, etc). If you have any concerns or comments please contact us at
                        <a href="mailto:decksofkeyforge@gmail.com">decksofkeyforge@gmail.com</a>
                    </i>
                </div>
            """.trimIndent()
        )
    }

    private fun makeLink(path: String) = "https://decksofkeyforge.com$path"

    private fun sendEmail(email: String, subject: String, content: String) {
        val mimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(mimeMessage, false, "UTF-8")
        mimeMessage.setContent(content, "text/html")
        val from = "noreply@decksofkeyforge.com"
        helper.setFrom(from)
        helper.setReplyTo(from)
        mimeMessage.addFrom(InternetAddress.parse(from))
        helper.setTo(email)
        helper.setSubject(subject)
        emailSender.send(mimeMessage)
    }
}
