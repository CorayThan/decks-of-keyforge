package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.thirdpartyservices.KeyForgeDeckLinks

@JsonIgnoreProperties(ignoreUnknown = true)
data class KeyForgeDeck(
    val id: String,
    val name: String,
    val expansion: Int,
    val power_level: Int = 0,
    val chains: Int = 0,
    val wins: Int = 0,
    val losses: Int = 0,
    val cards: List<String>? = null,
    val _links: KeyForgeDeckLinks? = null,
    val bonus_icons: List<KeyForgeCardBonusIcons>? = null,
) {

    fun createBonusIconsInfo(houses: List<House>, cards: List<Card>): DeckBonusIcons {
        if (bonus_icons.isNullOrEmpty()) {
            return DeckBonusIcons(
                bonusIconHouses = listOf()
            )
        }

        val iconsMap: Map<String, List<String>> = this.bonus_icons.associate { it.card_id to it.bonus_icons }

        return DeckBonusIcons(
            bonusIconHouses = houses
                .map { house ->
                    val cardsForHouse = cards.filter { it.house == house }
                    BonusIconHouse(
                        house = house,
                        bonusIconCards = cardsForHouse.mapNotNull {
                            val iconsForCard = iconsMap[it.id]
                            if (iconsForCard == null) {
                                null
                            } else {
                                BonusIconsCard(
                                    cardTitle = it.cardTitle,
                                    bonusAember = iconsForCard.count { icon -> icon == "amber" },
                                    bonusCapture = iconsForCard.count { icon -> icon == "capture" },
                                    bonusDamage = iconsForCard.count { icon -> icon == "damage" },
                                    bonusDraw = iconsForCard.count { icon -> icon == "draw" },
                                )
                            }
                        }
                    )
                }
        )
    }

    fun toDeck() = Deck(
        keyforgeId = id,
        name = name,
        expansion = expansion,
        powerLevel = power_level,
        chains = chains,
        wins = wins,
        losses = losses,
    )
}
