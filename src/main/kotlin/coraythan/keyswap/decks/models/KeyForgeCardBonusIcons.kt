package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeCardBonusIcons(
    val card_id: String,
    val bonus_icons: List<String>
)
