package coraythan.keyswap.userdeck

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.decks.Deck
import coraythan.keyswap.users.KeyUser
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class UserDeck(

        @JsonIgnoreProperties("decks")
        @ManyToOne
        val user: KeyUser,

        @ManyToOne
        val deck: Deck,

        val wishlist: Boolean = false,
        val funny: Boolean = false,
        val ownedBy: String? = null,

        // Deck selling info below
        val forSale: Boolean = false,
        val forTrade: Boolean = false,

        val askingPrice: Double? = null,

        val listingInfo: String? = null,

        val condition: DeckCondition? = null,
        val redeemed: Boolean = true,
        val externalLink: String? = null,

        val dateListed: ZonedDateTime? = null,
        val expiresAt: ZonedDateTime? = null,

        @Id
        val id: UUID = UUID.randomUUID()
        )

enum class DeckCondition {
    NEW_IN_PLASTIC,
    NEAR_MINT,
    PLAYED,
    HEAVILY_PLAYED
}
