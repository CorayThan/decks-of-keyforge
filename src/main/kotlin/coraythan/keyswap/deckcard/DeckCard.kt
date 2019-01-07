package coraythan.keyswap.deckcard

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.cards.Card
import coraythan.keyswap.decks.Deck
import java.util.*
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class DeckCard(

        @JsonIgnoreProperties("cards")
        @ManyToOne(fetch = FetchType.LAZY)
        val deck: Deck,

        @ManyToOne(fetch = FetchType.LAZY)
        val card: Card,

        val cardName: String,
        val quantityInDeck: Int,

        @Id
        val id: UUID = UUID.randomUUID()
)