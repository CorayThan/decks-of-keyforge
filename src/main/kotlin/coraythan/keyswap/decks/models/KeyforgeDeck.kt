package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.thirdpartyservices.KeyforgeDeckLinks

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyforgeDeck(
        val id: String,
        val name: String,
        val expansion: Int,
        val power_level: Int = 0,
        val chains: Int = 0,
        val wins: Int = 0,
        val losses: Int = 0,
        val cards: List<String>? = null,
        val _links: KeyforgeDeckLinks? = null
) {
    fun toDeck() = Deck(
            keyforgeId = id,
            name = name,
            expansion = expansion,
            powerLevel = power_level,
            chains = chains,
            wins = wins,
            losses = losses
    )
}
