package coraythan.keyswap.emails

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.Env
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import javax.mail.internet.InternetAddress

@Service
class EmailService(
        private val emailSender: JavaMailSender,
        private val keyUserService: KeyUserService,
        private val passwordResetCodeService: PasswordResetCodeService,
        private val currentUserService: CurrentUserService,
        @Value("\${env}")
        private val env: Env
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun sendErrorMessageToMe(e: Exception) {
        sendEmail("decksofkeyforge@gmail.com", "Error on DoK! ${e.message}", e.toString())
    }

    fun sendOutBidEmail(buyer: KeyUser, deck: Deck, timeLeft: String) {
        try {
            sendEmail(
                    buyer.primaryEmail,
                    "You've been outbid in the auction for ${deck.name}!",
                    """
                    <div>
                        You've been outbid in the auction for ${makeLink("/decks/${deck.keyforgeId}", deck.name)}.
                    </div>
                    <br>
                    <br>
                    <div>
                        The auction ends in $timeLeft from the time this email was sent.
                    </div>
                    <br>
                    <br>
                    <div>
                        You'll need to place another bid before then if you want to win the deck!
                    </div>
                """.trimIndent()
            )
        } catch (e: Exception) {
            log.warn("Couldn't send outbid notification to ${buyer.primaryEmail}", e)
        }
    }

    fun sendSomeoneElseBoughtNowEmail(buyer: KeyUser, deck: Deck) {
        try {
            sendEmail(
                    buyer.primaryEmail,
                    "Some chose Buy It Now for ${deck.name}!",
                    """
                    <div>
                        Someone else has purchased the deck ${makeLink("/decks/${deck.keyforgeId}", deck.name)}, for which you were the highest bidder.
                    </div>
                """.trimIndent()
            )
        } catch (e: Exception) {
            log.warn("Couldn't send outbid notification to ${buyer.primaryEmail}", e)
        }
    }

    fun sendAuctionPurchaseEmail(buyer: KeyUser, seller: KeyUser, deck: Deck, price: Int, currencySymbol: String) {
        try {
            sendEmail(
                    seller.primaryEmail,
                    "${deck.name} has sold on auction!",
                    """
                    <div>
                        ${buyer.username} has won the deck ${makeLink("/decks/${deck.keyforgeId}", deck.name)} for $currencySymbol$price plus any shipping
                        listed in the auction description.
                    </div>
                    <br>
                    <br>
                    <div>
                        You can reply to this email to contact the buyer.
                    </div>
                """.trimIndent(),
                    buyer.primaryEmail
            )
        } catch (e: Exception) {
            log.warn("Couldn't send deck sold email to seller for ${seller.primaryEmail}", e)
        }
        try {
            sendEmail(
                    buyer.primaryEmail,
                    "You have won the auction for ${deck.name}!",
                    """
                    <div>
                        You have won the deck ${makeLink("/decks/${deck.keyforgeId}", deck.name)} for $currencySymbol$price plus any shipping listed in
                        the auction description.
                    </div>
                    <br>
                    <br>
                    <div>
                        You can reply to this email to contact the seller, or use any listed seller contact information on the
                        ${makeLink("/decks?completedAuctions=true&forAuction=true&title=${deck.name}", "auction")}

                    </div>
                """.trimIndent(),
                    seller.primaryEmail
            )
        } catch (e: Exception) {
            log.warn("Couldn't send deck sold email to buyer for ${seller.primaryEmail}", e)
        }
    }

    fun sendAuctionDidNotSellEmail(seller: KeyUser, deck: Deck) {
        sendEmail(
                seller.primaryEmail,
                "Your deck for auction ${deck.name} did not sell",
                """
                    <div>
                        The minimum bid for ${makeLink("/decks/${deck.keyforgeId}", deck.name)} was not met before the end of the auction.
                    </div>
                """.trimIndent()
        )
    }

    fun sendResetPassword(reset: ResetEmail) {
        val userInSystem = keyUserService.findByEmail(reset.email)
        if (userInSystem != null) {
            val resetCode = passwordResetCodeService.createCode(reset.email)
            sendEmail(reset.email, "Reset your decksofkeyforge.com password",
                    """
                <div>
                    Use this link to reset your password. It will expire in 24 hours.
                    ${makeLink("/reset-password/$resetCode", "Reset Password")}
                </div>
            """.trimIndent()
            )
        }
    }

    fun sendVerifyEmail(verify: ResetEmail) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        if (currentUser.email != verify.email && currentUser.sellerEmail != verify.email) {
            throw BadRequestException("You don't have the email ${verify.email}")
        }
        val resetCode = passwordResetCodeService.createCode(verify.email, currentUser.id)
        sendEmail(verify.email, "Verify your decksofkeyforge.com email",
                """
                <div>
                    Use this link to verify your email:
                    ${makeLink("/verify-email/$resetCode", "Verify Email")}
                </div>
            """.trimIndent()
        )
    }

    fun sendDeckListedNotification(recipient: KeyUser, listingInfo: ListingInfo, deck: Deck, queryName: String) {

        try {

            val availableFor = when {
                listingInfo.auction -> "as an auction"
                else -> "for sale"
            }

            log.info("Sending deck listed notification.")
            sendEmail(
                    recipient.email,
                    "\"$queryName\" matches a deck listed on Decks of KeyForge",
                    """
                    <div>
                        <div>
                            The deck ${makeLink("/decks/${deck.keyforgeId}", deck.name)} matches the query "$queryName" you've set up to
                            email you whenever a deck is listed for sale.
                        </div>
                        <br>
                        <div>
                            It is available $availableFor.
                        </div>
                        <br>
                        <div>
                            ${if (listingInfo.buyItNow == null) "" else "Its price is ${listingInfo.buyItNow}."}
                        </div>
                        <br>
                        <div>
                            To turn off these notifications login to Decks of KeyForge and go to your ${makeLink("/my-profile", "profile")}.
                        </div>
                    </div>
                """.trimIndent()
            )

        } catch (e: Exception) {
            log.warn("Couldn't send deck listed notification email.", e)
        }
    }

    fun sendMessageToSeller(sellerMessage: SellerMessage) {

        val seller = keyUserService.findUserByUsername(sellerMessage.username)
                ?: throw BadRequestException("Couldn't find user with username ${sellerMessage.username}")
        val email = seller.sellerEmail ?: seller.email


        val senderUsername = sellerMessage.senderUsername
        val deckKeyforgeId = sellerMessage.deckKeyforgeId
        val deckName = sellerMessage.deckName
        val ccSender = seller.sellerEmail != null
        val senderEmail = sellerMessage.senderEmail
        val message = sellerMessage.message

        val emailContents = deckMessageEmailContent(senderUsername, deckKeyforgeId, deckName, ccSender, senderEmail, message)
        sendEmail(
                email,
                "$deckName has a message on Decks of KeyForge",
                emailContents,
                senderEmail,
                ccEmail = if (ccSender) senderEmail else null
        )
        if (!ccSender) {
            sendEmail(
                    senderEmail,
                    "We sent this email to the seller of $deckName",
                    emailContents
            )
        }
    }

    private fun deckMessageEmailContent(senderUsername: String, deckKeyforgeId: String, deckName: String, ccSender: Boolean, senderEmail: String, message: String) =
            """
                <div>
                    <div>
                        $senderUsername has sent you a message about
                        ${makeLink("/decks/$deckKeyforgeId", deckName)}, which you have listed for sale or trade on
                        ${makeLink("", "decksofkeyforge.com")}
                    </div>
                    <br>
                    <div>
                        ${if (ccSender) {
                "We have included $senderUsername on this email since you have a public sellers email. You "
            } else {
                "We have not given $senderUsername your email address, but you "
            }}
                        can reply to their message at
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
                        an email through our service if the listing doesn't have an external link listed. We do not give them your email address without permission.
                        If you have any concerns or comments please contact us at
                        <a href="mailto:decksofkeyforge@gmail.com">decksofkeyforge@gmail.com</a>
                    </i>
                </div>
            """.trimIndent()

    private fun makeLink(path: String, name: String) = "<a href=\"${env.baseUrl}$path\">$name</a>"

    private fun sendEmail(email: String, subject: String, content: String, replyTo: String? = null, ccEmail: String? = null) {
        val mimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(mimeMessage, false, "UTF-8")
        mimeMessage.setContent(content, "text/html")
        val fromEmail = "noreply@decksofkeyforge.com"
        val fromAddress = InternetAddress(fromEmail, "Decks of KeyForge")
        helper.setFrom(fromAddress)
        helper.setFrom(fromAddress)
        if (replyTo != null) helper.setReplyTo(replyTo)
        mimeMessage.addFrom(listOf(fromAddress).toTypedArray())
        helper.setTo(if (env == Env.dev) "decksofkeyforge@gmail.com" else email)
        if (ccEmail != null) helper.setCc(if (env == Env.dev) "decksofkeyforge@gmail.com" else ccEmail)
        helper.setSubject(subject)
        emailSender.send(mimeMessage)
    }
}
