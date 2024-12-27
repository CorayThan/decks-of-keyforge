package coraythan.keyswap.decks.theoreticaldecks

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import coraythan.keyswap.decks.models.DeckBonusIcons
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.*

@Entity
data class TheoreticalDeck(
    val expansion: Int? = null,
    val cardIds: String = "",
    val bonusIconsString: String? = null,

    val houseNamesString: String = "",

    val creatorId: UUID,
    val alliance: Boolean = false,

    val deckName: String? = null,

    val convertedToAlliance: Boolean = false,

    @Id
    val id: UUID = UUID.randomUUID()
) {
    fun bonusIcons(): DeckBonusIcons {
        val toParse = this.bonusIconsString?.trim()
        if (toParse.isNullOrEmpty()) {
            return DeckBonusIcons()
        }
        return jacksonObjectMapper().readValue<DeckBonusIcons>(toParse)
    }
}
