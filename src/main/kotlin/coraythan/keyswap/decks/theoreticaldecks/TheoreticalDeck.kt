package coraythan.keyswap.decks.theoreticaldecks

import org.hibernate.annotations.Type
import java.util.*
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Lob

@Entity
data class TheoreticalDeck(
        val expansion: Int? = null,
        @Lob
        @Type(type = "org.hibernate.type.TextType")
        val cardIds: String = "",

        val houseNamesString: String = "",

        val creatorId: UUID,
        val alliance: Boolean = false,

        val deckName: String? = null,

        val convertedToAlliance: Boolean = false,

        @Id
        val id: UUID = UUID.randomUUID()
)
