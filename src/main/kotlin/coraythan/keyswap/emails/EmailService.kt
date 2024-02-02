package coraythan.keyswap.emails

import coraythan.keyswap.auctions.offers.OfferRepo
import coraythan.keyswap.config.AppLinks
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.config.Env
import coraythan.keyswap.config.UnauthorizedException
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckSasValuesSearchable
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.roundToOneSigDig
import coraythan.keyswap.userdeck.ListingInfo
import coraythan.keyswap.users.*
import jakarta.mail.internet.InternetAddress
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.repository.findByIdOrNull
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import java.util.*

@Service
class EmailService(
    private val emailSender: JavaMailSender,
    private val keyUserService: KeyUserService,
    private val passwordResetCodeService: PasswordResetCodeService,
    private val currentUserService: CurrentUserService,
    private val offerRepo: OfferRepo,
    private val links: AppLinks,
    private val userRepo: KeyUserRepo,
    @Value("\${env}")
    private val env: Env
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun sendErrorMessageToMe(message: String, e: Exception) {
        sendEmail(
            "decksofkeyforge@gmail.com",
            "Error on DoK! $message",
            "message: ${e.message} to string: $e",
            "Error Notif"
        )
    }

    fun sendBoughtNowEmail(buyer: KeyUser, seller: KeyUser, deck: Deck, price: Int) {
        val currencySymbol = seller.currencySymbol
        val shippingCost = seller.shippingCost
        try {
            sendEmail(
                seller.primaryEmail,
                "${deck.name} has sold!",
                """
                    <div>
                        ${links.userLink(buyer.username)} has purchased the deck ${links.deckLink(deck)} for $currencySymbol$price plus shipping.
                    </div>
                    <br>
                    <br>
                    <div>
                        The shipping costs at the time of sale were: ${shippingCost ?: "None listed"}
                    </div>
                    <br>
                    <br>
                    <div>
                        You can reply to this email to contact the buyer.
                    </div>
                """.trimIndent(),
                "Deck Sold",
                buyer.primaryEmail
            )
        } catch (e: Exception) {
            log.warn("Couldn't send deck sold email to seller for ${seller.primaryEmail}", e)
        }
        try {
            sendEmail(
                buyer.primaryEmail,
                "You have purchased ${deck.name}!",
                """
                    <div>
                        You have purchased the deck ${links.deckLink(deck)} for $currencySymbol$price plus shipping.
                    </div>
                    <br>
                    <br>
                    <div>
                        The shipping costs at the time of sale were: ${shippingCost ?: "None listed"}
                    </div>
                    <br>
                    <br>
                    <div>
                        You can reply to this email to contact the seller. 
                        They may also have contact info on their profile: ${links.userLink(seller.username)}.
                    </div>
                """.trimIndent(),
                "Deck Purchased",
                seller.primaryEmail
            )
        } catch (e: Exception) {
            log.warn("Couldn't send deck sold email to buyer for ${seller.primaryEmail}", e)
        }
    }

    fun sendResetPassword(reset: ResetEmail) {
        val userInSystem = keyUserService.findByEmail(reset.email)
        if (userInSystem != null) {
            val resetCode = passwordResetCodeService.createCode(reset.email)
            sendEmail(
                reset.email, "Reset your decksofkeyforge.com password",
                """
                <div>
                    Use this link to reset your password. It will expire in 24 hours.
                    ${links.resetPassword(resetCode)}
                </div>
            """.trimIndent(),
                "Reset Password"
            )
        }
    }

    fun sendVerifyEmail(verify: ResetEmail) {
        val currentUser = currentUserService.loggedInUserOrUnauthorized()
        if (currentUser.email != verify.email && currentUser.sellerEmail != verify.email) {
            throw BadRequestException("You don't have the email ${verify.email}")
        }
        val resetCode = passwordResetCodeService.createCode(verify.email, currentUser.id)
        sendEmail(
            verify.email, "Verify your decksofkeyforge.com email",
            """
                <div>
                    Use this link to verify your email:
                    ${links.verifyEmail(resetCode)}
                </div>
            """.trimIndent(),
            "Verify Email"
        )
    }

    fun sendDeckListedNotification(
        recipientId: UUID,
        listingInfo: ListingInfo,
        deck: DeckSasValuesSearchable,
        queryName: String,
        sellerUsername: String
    ) {

        val recipient =
            userRepo.findByIdOrNull(recipientId) ?: throw IllegalStateException("No user with id $recipientId")

        try {

            val availableFor = when {
                listingInfo.auction -> "as an auction"
                else -> "for sale"
            }

            sendEmail(
                recipient.primaryEmail,
                "\"$queryName\" matches a deck listed on DoK",
                """
                    <div>
                        <div>
                            The deck ${links.deckLink(deck.deck)} matches the query "$queryName" you've set up to
                            email you whenever a deck is listed for sale.
                        </div>
                        <br>
                        <div>
                            It is available $availableFor. From the seller ${links.userLink(sellerUsername)}
                        </div>
                        <br>
                        <div>
                            ${if (listingInfo.buyItNow == null) "" else "Its price is ${listingInfo.buyItNow}."}
                        </div>
                        <br>
                        ${this.makeDeckStats(deck)}
                    </div>
                """.trimIndent(),
                "Deck For Sale",
                bottomContent = "You can turn off these emails on your ${links.myDeckNotifications()}."
            )

        } catch (e: Exception) {
            log.warn("Couldn't send deck listed notification email.", e)
        }
    }

    fun sendMessageToSeller(sellerMessage: SellerMessage) {

        val emailSender = currentUserService.loggedInUserOrUnauthorized()

        val seller = keyUserService.findUserByUsername(sellerMessage.username)
            ?: throw BadRequestException("Couldn't find user with username ${sellerMessage.username}")
        val email = seller.primaryEmail


        val senderUsername = emailSender.username
        val deckKeyforgeId = sellerMessage.deckKeyforgeId
        val deckName = sellerMessage.deckName
        val ccSender = seller.sellerEmail != null
        val senderEmail = emailSender.primaryEmail
        val message = sellerMessage.message

        val messageStart = """
                        $senderUsername has sent you a message about
                        ${links.deckLink(deckKeyforgeId, deckName)}, which you have listed for sale on
                        ${links.homePage()}
        """.trimIndent()

        val emailContents = userToUserEmailContent(messageStart, senderUsername, ccSender, senderEmail, message)

        val bottomContent = """
            Users can send you an email through our service for any decks you have listed for sale. 
            We do not give them your email address without permission.
            For questions email
            <a href="mailto:decksofkeyforge@gmail.com">decksofkeyforge@gmail.com</a>
        """.trimIndent()

        sendEmail(
            email,
            "$deckName has a message on DoK",
            emailContents,
            "Message Received",
            senderEmail,
            ccEmail = if (ccSender) senderEmail else null,
            bottomContent = bottomContent
        )
        if (!ccSender) {
            sendEmail(
                senderEmail,
                "We sent this email to ${sellerMessage.username}, the seller of $deckName",
                emailContents,
                "Message Sent",
                bottomContent = bottomContent
            )
        }
    }

    fun sendOfferReceivedEmail(deck: Deck, amount: Int, seller: KeyUser, offerer: KeyUser) {
        val currencySymbol = seller.currencySymbol
        val message = """
                    <div>
                        <div>
                            You've received an offer of ${currencySymbol}${amount} for ${links.deckLink(deck)}! 
                            This offer was made by ${offerer.username}. 
                            View your ${links.offersLink()} on DoK to accept or reject this offer.
                        </div>
                    </div>
                """.trimIndent()

        sendEmail(
            seller.primaryEmail,
            "You've received an offer of ${currencySymbol}${amount} for ${deck.name}",
            message,
            "Offer Received",
            bottomContent = "You can stop future offer notifications for this deck by canceling its sale ${
                links.deckLink(
                    deck
                )
            }"
        )
    }

    fun sendOfferMessage(offerId: UUID, message: String) {

        val emailSender = currentUserService.loggedInUserOrUnauthorized()
        val offer = offerRepo.findByIdOrNull(offerId) ?: throw IllegalStateException("No offer for $offerId")

        val isOfferRecipient = offer.recipient.id == emailSender.id
        val isOfferSender = offer.sender.id == emailSender.id

        val emailRecipient = when {
            isOfferRecipient -> offer.sender
            isOfferSender -> offer.recipient
            else -> throw UnauthorizedException("You must be the sender or recipient of an offer to send an email about it.")
        }

        val ccSender = emailRecipient.sellerEmail != null
        val deckKeyforgeId = offer.auction.deck.keyforgeId
        val deckName = offer.auction.deck.name
        val senderUsername = emailSender.username
        val senderEmail = emailSender.primaryEmail

        log.info("message: $message")

        val messageStart = """
            $senderUsername has sent you a message about ${if (isOfferSender) "their" else "your"} offer of ${offer.offerDetailsReadable()} 
            to buy ${links.deckLink(deckKeyforgeId, deckName)}.
            <br>
            <br>
            ${if (offer.message.isBlank()) "" else "The message that came with the offer is: \"${offer.message}\""}
        """.trimMargin()

        val bottomContent = "View offers to and from you on your ${links.offersLink()}."

        val emailContents = userToUserEmailContent(messageStart, senderUsername, ccSender, senderEmail, message)
        sendEmail(
            emailRecipient.primaryEmail,
            "$deckName has a message about an offer on DoK",
            emailContents,
            "Offer Message",
            senderEmail,
            ccEmail = if (ccSender) senderEmail else null,
            bottomContent = bottomContent
        )
        if (!ccSender) {
            sendEmail(
                senderEmail,
                "We sent this email about an offer for $deckName",
                emailContents,
                "Offer Message Sent",
                bottomContent = bottomContent
            )
        }
    }

    fun sendOfferAcceptedEmail(deck: Deck, offerSender: KeyUser, seller: KeyUser, amount: Int) {
        val currencySymbol = seller.currencySymbol
        val shippingCost = seller.shippingCost
        val message = """
                    <div>
                        <div>
                            Your offer for ${links.deckLink(deck)} has been accepted! 
                            You have agreed to pay ${currencySymbol}${amount} plus shipping to ${links.userLink(seller.username)}.
                            Reply to this email to arrange payment and shipment of your deck.
                        </div>
                        <br>
                        <br>
                        <div>
                            The shipping costs at the time of sale were: ${shippingCost ?: "None listed"}
                        </div>
                    </div>
                """.trimIndent()

        sendEmail(
            offerSender.primaryEmail,
            "Your offer for ${deck.name} has been accepted!",
            message,
            "Offer Accepted",
            seller.primaryEmail,
            seller.primaryEmail,
            bottomContent = "You can stop future offer notifications by canceling offers you've made on your ${links.offersLink()}"
        )
    }

    fun sendOfferRejectedEmail(
        deck: Deck,
        recipient: KeyUser,
        acceptedDifferent: Boolean = false,
        seller: KeyUser,
        amount: Int
    ) {
        val currencySymbol = seller.currencySymbol
        sendEmail(
            recipient.primaryEmail,
            "Your offer for ${deck.name} has been turned down",
            """
                    <div>
                        <div>
                            Your offer of $currencySymbol${amount} for ${links.deckLink(deck)} has been turned down. ${if (acceptedDifferent) "The seller accepted a different offer." else ""}
                        </div>
                    </div>
                """.trimIndent(),
            "Offer Rejected",
            bottomContent = "You can stop future offer rejected notifications by canceling offers you've made on your ${links.offersLink()}"
        )
    }

    private fun userToUserEmailContent(
        messageStart: String,
        senderUsername: String,
        ccSender: Boolean,
        senderEmail: String,
        message: String
    ) =
        """
                <div>
                    <div>
                        $messageStart
                    </div>
                    <br>
                    <div>
                        ${
            if (ccSender) {
                "We have included $senderUsername on this email since you have a public contact email. You "
            } else {
                "We have not given $senderUsername your email address, but you "
            }
        }
                        can reply to their message at
                        <a href="mailto:$senderEmail">$senderEmail</a>
                    </div>
                    <br>
                    <b>$senderUsername's message</b>
                    <br>
                    <div style="white-space: pre-wrap; color: #444444;">$message</div>
                </div>
            """.trimIndent()

    private fun sendEmail(
        email: String,
        subject: String,
        content: String,
        title: String,
        replyTo: String? = null,
        ccEmail: String? = null,
        bottomContent: String? = null
    ) {
        val mimeMessage = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(mimeMessage, false, "UTF-8")
        mimeMessage.setContent(EmailFormatter.format(title, content, bottomContent, links), "text/html")
        val fromEmail = "noreply@decksofkeyforge.com"
        val fromAddress = InternetAddress(fromEmail, "Decks of KeyForge")
        helper.setFrom(fromAddress)
        if (replyTo != null) helper.setReplyTo(replyTo)
        helper.setTo(if (env == Env.dev) "decksofkeyforge@gmail.com" else email)
        if (ccEmail != null) helper.setCc(if (env == Env.dev) "decksofkeyforge@gmail.com" else ccEmail)
        helper.setSubject(if (env == Env.dev) "Dok Dev Email: $subject" else subject)
        emailSender.send(mimeMessage)
    }

    private fun makeDeckStats(dsvs: DeckSasValuesSearchable): String {
        return """
<table>
    <tr>
        <td>${dsvs.name}</td>
    </tr>
    <tr>
        <td>${dsvs.sasRating} SAS     ${Expansion.forExpansionNumber(dsvs.expansion).readable}     ${
            dsvs.houseNamesString.replace(
                "|",
                " - "
            )
        }</td>
    </tr>
    <tr>
        <td>
            <table border="0" cellspacing="8" cellpadding="0">
                <tr>
                    <td>Aember Control (A)</td>
                    <td>${dsvs.amberControl.roundToOneSigDig()}</td>
                    <td>Actions</td>
                    <td>${dsvs.actionCount}</td>
                </tr>
                <tr>
                    <td>Expected Aember (E)</td>
                    <td>${dsvs.expectedAmber.roundToOneSigDig()}</td>
                    <td>Creatures</td>
                    <td>${dsvs.creatureCount}</td>                    
                </tr>
                <tr>
                    <td>Artifact Control (R)</td>
                    <td>${dsvs.artifactControl.roundToOneSigDig()}</td>
                    <td>Artifacts</td>
                    <td>${dsvs.artifactCount}</td>                    
                </tr>
                <tr>
                    <td>Creature Control (C)</td>
                    <td>${dsvs.creatureControl.roundToOneSigDig()}</td>
                    <td>Upgrades</td>
                    <td>${dsvs.upgradeCount}</td>                    
                </tr>
                <tr>
                    <td>Effective Power (P)</td>
                    <td>${dsvs.effectivePower}</td>
                </tr>
                <tr>
                    <td>Efficiency (F)</td>
                    <td>${dsvs.efficiency.roundToOneSigDig()}</td>
                </tr>
                <tr>
                    <td>Recursion (U)</td>
                    <td>${dsvs.recursion.roundToOneSigDig()}</td>
                </tr>
                <tr>
                    <td>Disruption (D)</td>
                    <td>${dsvs.disruption.roundToOneSigDig()}</td>
                </tr>
                <tr>
                    <td>Creature Protection (CP)</td>
                    <td>${dsvs.creatureProtection.roundToOneSigDig()}</td>
                </tr>
                <tr>
                    <td>Other (O)</td>
                    <td>${dsvs.other.roundToOneSigDig()}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
        """.trimIndent()
    }
}
