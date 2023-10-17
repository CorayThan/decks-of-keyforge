package coraythan.keyswap.decks.theoreticaldecks

import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.*

@Entity
data class TheoreticalDeck(
    val expansion: Int? = null,
    val cardIds: String = "",

    val houseNamesString: String = "",

    val creatorId: UUID,
    val alliance: Boolean = false,

    val deckName: String? = null,

    val convertedToAlliance: Boolean = false,

    @Id
    val id: UUID = UUID.randomUUID()
)
