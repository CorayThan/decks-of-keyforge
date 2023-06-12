package coraythan.keyswap.thirdpartyservices.mastervault

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.decks.models.*

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

        val icons: MutableList<Pair<String, List<String>>> = this.bonus_icons.map { it.card_id to it.bonus_icons }.toMutableList()

        return DeckBonusIcons(
            bonusIconHouses = houses
                .map { house ->
                    val cardsForHouse = cards.filter { it.house == house }
                    BonusIconHouse(
                        house = house,
                        bonusIconCards = cardsForHouse.mapNotNull {
                            val iconsForCardIdx = icons.indexOfFirst { iconInfo -> iconInfo.first == it.id }
                            val iconsForCard = icons.getOrNull(iconsForCardIdx)
                            if (iconsForCard == null) {
                                null
                            } else {
                                icons.removeAt(iconsForCardIdx)
                                BonusIconsCard(
                                    cardTitle = it.cardTitle,
                                    bonusAember = iconsForCard.second.count { icon -> icon == "amber" },
                                    bonusCapture = iconsForCard.second.count { icon -> icon == "capture" },
                                    bonusDamage = iconsForCard.second.count { icon -> icon == "damage" },
                                    bonusDraw = iconsForCard.second.count { icon -> icon == "draw" },
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
