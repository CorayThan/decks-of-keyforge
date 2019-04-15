package coraythan.keyswap.emails

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.KeyUser
import coraythan.keyswap.users.KeyUserService
import coraythan.keyswap.users.PasswordResetCodeService
import coraythan.keyswap.users.ResetEmail
import org.slf4j.LoggerFactory
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

    private val log = LoggerFactory.getLogger(this::class.java)

    fun sendResetPassword(reset: ResetEmail) {
        val userInSystem = keyUserService.findByEmail(reset.email)
        if (userInSystem != null) {
            val resetCode = passwordResetCodeService.createCode(reset.email)
            sendEmail(reset.email, "Reset your decksofkeyforge.com password",
                    """
                <div>
                    Use this link to reset your password. It will expire in 24 hours.
                    ${makeLink("/reset-password/$resetCode", "Reset Email Link")}
                </div>
            """.trimIndent()
            )
        }
    }

    fun sendDeckListedNotification(recipient: KeyUser, listingInfo: ListingInfo, deck: Deck, queryName: String) {

        val availableFor = when {
            listingInfo.auctionListingInfo != null -> "as an auction"
            listingInfo.forSale && listingInfo.forTrade -> "for sale or trade"
            listingInfo.forSale -> "for sale"
            listingInfo.forTrade -> "for trade"
            else -> throw BadRequestException("Deck must be available for sale, trade, or auction.")
        }

        log.info("Sending deck listed notification.")
        sendEmail(
                recipient.email,
                "A new deck listed on Decks of Keyforge matches $queryName",
                """
                    <div>
                        <div>
                            The deck ${makeLink("/decks/${deck.keyforgeId}", deck.name)} matches the query "$queryName" you've set up to
                            email you whenever a new deck is listed for sale.
                        </div>
                        <br>
                        <div>
                            It is available $availableFor.
                        </div>
                        <br>
                        <div>
                            ${if (listingInfo.askingPrice == null) "" else "Its price is ${listingInfo.askingPrice}."}
                        </div>
                        <br>
                        <div>
                            To turn off these notifications login to Decks of Keyforge and go to your ${makeLink("/my-profile", "profile")}.
                        </div>
                    </div>
                """.trimIndent()
        )
    }

    fun sendMessageToSeller(sellerMessage: SellerMessage) {

        val seller = keyUserService.findUserByUsername(sellerMessage.username)
                ?: throw BadRequestException("Couldn't find user with username ${sellerMessage.username}")
        val email = seller.sellerEmail ?: seller.email

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
                        ${makeLink("/decks/$deckKeyforgeId", deckName)}, which you have listed for sale or trade on
                        ${makeLink("", "decksofkeyforge.com")}
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
            """.trimIndent(),
                senderEmail
        )
    }

    private fun makeLink(path: String, name: String) = "<a href=\"https://decksofkeyforge.com$path\">$name</a>"

    private fun sendEmail(email: String, subject: String, content: String, replyTo: String? = null) {
        val mimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(mimeMessage, false, "UTF-8")
        mimeMessage.setContent(content, "text/html")
        val from = "noreply@decksofkeyforge.com"
        helper.setFrom(from)
        helper.setReplyTo(replyTo ?: from)
        mimeMessage.addFrom(InternetAddress.parse(from))
        helper.setTo(email)
        helper.setSubject(subject)
        emailSender.send(mimeMessage)
    }
}
