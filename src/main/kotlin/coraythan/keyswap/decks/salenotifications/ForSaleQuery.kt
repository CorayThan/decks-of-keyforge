package coraythan.keyswap.decks.salenotifications

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.decks.Constraint
import coraythan.keyswap.decks.DeckCardQuantity
import coraythan.keyswap.decks.DeckQuery
import coraythan.keyswap.generic.Country
import coraythan.keyswap.users.KeyUser
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class ForSaleQueryEntity(
        val name: String,
        val json: String,

        /**
         * This should never be null when saved to the DB
         */
        @JsonIgnoreProperties("forSaleQueries")
        @ManyToOne
        val user: KeyUser?,

        val active: Boolean = true,

        @Id
        val id: UUID = UUID.randomUUID()
)

data class ForSaleQuery(

        val queryName: String,

        override val houses: Set<House> = setOf(),

        override val title: String = "",

        override val forSale: Boolean = false,
        override val forTrade: Boolean = false,
        override val forSaleInCountry: Country? = null,
        override val includeUnregistered: Boolean = false,

        override val constraints: List<Constraint> = listOf(),

        override val cards: List<DeckCardQuantity> = listOf(),

        override val owner: String = "",

        val id: UUID? = null

) : DeckQuery {
        override val myFavorites: Boolean
                get() = false
}
