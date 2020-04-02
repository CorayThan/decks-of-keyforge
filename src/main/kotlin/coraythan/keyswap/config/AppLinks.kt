package coraythan.keyswap.config

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
    fun verifyEmail(resetCode: String) = makeLink("/verify-email/$resetCode", "Verify Email")
    fun resetPassword(resetCode: String) = makeLink("/reset-password/$resetCode", "Reset Password")
    fun deckCompletedAuctions(name: String) = makeLink("/decks?completedAuctions=true&forAuction=true&title=${name}", "auction")
    fun deckLink(deck: Deck) = makeLink("/decks/${deck.keyforgeId}", deck.name)
    fun deckLink(keyforgeId: String, name: String) = makeLink("/decks/$keyforgeId", name)
    fun offersLink() = makeLink("/my-dok/offers", "Offers Page")

    private final fun makeUrlPath(path: String) = "${env.baseUrl}$path"
    private fun makeLink(path: String, name: String) = "<a href=\"${makeUrlPath(path)}\">$name</a>"
}
