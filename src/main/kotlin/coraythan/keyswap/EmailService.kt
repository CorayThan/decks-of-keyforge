package coraythan.keyswap

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import javax.mail.internet.InternetAddress

@Service
class EmailService(
        private val emailSender: JavaMailSender
) {
    fun sendResetPassword(email: String, resetCode: String) {
        val mimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(mimeMessage, false, "UTF-8")
        val resetEmailLink = "https://decksofkeyforge.com/reset-password/$resetCode"
        mimeMessage.setContent(
                """
                    <div>
                        Use this link to reset your password. It will expire in 24 hours.
                        <a href="$resetEmailLink">$resetEmailLink</a>
                    </div>
                """.trimIndent()
                , "text/html")
        val from = "noreply@decksofkeyforge.com"
        helper.setFrom(from)
        helper.setReplyTo(from)
        mimeMessage.addFrom(InternetAddress.parse(from))
        helper.setTo(email)
        helper.setSubject("Reset your decksofkeyforge.com password")
        emailSender.send(mimeMessage)
    }
}