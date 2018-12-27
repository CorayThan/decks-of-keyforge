package coraythan.keyswap.userdecks

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
        @Id
        val id: UUID = UUID.randomUUID(),

        @JsonIgnoreProperties("decks")
        @ManyToOne
        val user: KeyUser,

        @ManyToOne
        val deck: Deck,

        val favorite: Boolean = false,
        val funny: Boolean = false,
        val owned: Boolean = false,

        // Deck selling info below
        val forSale: Boolean = false,
        val forTrade: Boolean = false,

        val askingPrice: String? = null,
        val tradeRequests: String? = null,

        val listingInfo: String? = null,

        val condition: DeckCondition? = null,
        val redeemed: Boolean = true,

        val dateListed: ZonedDateTime? = null,
        val dateRefreshed: ZonedDateTime? = null

)

enum class DeckCondition {
    NEW_IN_PLASTIC,
    NEAR_MINT,
    PLAYED
}
