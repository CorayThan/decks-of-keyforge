package coraythan.keyswap.config

import coraythan.keyswap.House
import coraythan.keyswap.decks.models.Deck
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class AppLinks(
        @Value("\${env}")
        private val env: Env
) {

    private val myProfilePath = "/my-dok/my-profile"
    val myProfileUrl = makeUrlPath(myProfilePath)

    fun homePage() = makeLink("", "decksofkeyforge.com")
    fun myProfile() = makeLink(myProfilePath, "profile")
    fun myDeckNotifications() = makeLink("/my-dok/notifications", "notifications page")
    fun verifyEmail(resetCode: String) = makeLink("/verify-email/$resetCode", "Verify Email")
    fun resetPassword(resetCode: String) = makeLink("/reset-password/$resetCode", "Reset Password")
    fun deckCompletedAuctions(name: String) = makeLink("/decks?completedAuctions=true&forAuction=true&title=${name}", "auction")
    fun deckLink(deck: Deck) = makeLink("/decks/${deck.keyforgeId}", deck.name)
    fun deckLink(keyforgeId: String, name: String) = makeLink("/decks/$keyforgeId", name)
    fun offersLink() = makeLink("/my-dok/offers", "Offers Page")

    fun dokImg() = makeImage("dok.png", 48, 48)
    fun houseImg(house: House) = makeImage("${house.toString().replace(" ", "-").toLowerCase()}.png")


    private final fun makeUrlPath(path: String) = "${env.baseUrl}$path"
    private fun makeLink(path: String, name: String) = "<a href=\"${makeUrlPath(path)}\">$name</a>"

    private final fun makeImgUrlPath(fileName: String) = "https://dok-imgs.s3.us-west-2.amazonaws.com/$fileName"
    private fun makeImage(fileName: String, width: Int? = null, height: Int? = null) =
            "<img src=\"${makeImgUrlPath(fileName)}\" ${if (width != null || height != null) "style=\"${if (width == null) "" else "width:${width}px;"}${if (height == null) "" else "height:${height}px;"}\"" else ""} />"
}
