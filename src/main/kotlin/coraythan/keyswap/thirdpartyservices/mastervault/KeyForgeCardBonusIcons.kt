package coraythan.keyswap.thirdpartyservices.mastervault

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeCardBonusIcons(
    val card_id: String,
    val bonus_icons: List<String>
)
