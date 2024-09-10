package coraythan.keyswap.thirdpartyservices.mastervault

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.dokcards.DokCardCacheService
import coraythan.keyswap.decks.models.BonusIconHouse
import coraythan.keyswap.decks.models.BonusIconsCard
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.decks.models.DeckBonusIcons

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

    companion object {
        val existingBonusIcons = setOf(
            "amber",
            "capture",
            "draw",
            "damage",
            "discard",
            "brobnar",
            "dis",
            "ekwidon",
            "geistoid",
            "logos",
            "mars",
            "skyborn"
        )
    }

    fun createBonusIconsInfo(houses: List<House>, cards: List<Card>): DeckBonusIcons {
        if (bonus_icons.isNullOrEmpty()) {
            return DeckBonusIcons(
                bonusIconHouses = listOf()
            )
        } else {
            val allIcons = this.bonus_icons.flatMap { it.bonus_icons }.toSet()
            if (allIcons.any { !existingBonusIcons.contains(it) }) {
                throw RuntimeException("Found an unknown bonus icon among $allIcons for deck id $id")
            }
        }

        val icons: MutableList<Pair<String, List<String>>> =
            this.bonus_icons.map { it.card_id to it.bonus_icons }.toMutableList()

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
                                    bonusDiscard = iconsForCard.second.count { icon -> icon == "discard" },
                                    bonusBobnar = iconsForCard.second.any { icon -> icon == "brobnar" },
                                    bonusDis = iconsForCard.second.any { icon -> icon == "dis" },
                                    bonusEkwidon = iconsForCard.second.any { icon -> icon == "ekwidon" },
                                    bonusGeistoid = iconsForCard.second.any { icon -> icon == "geistoid" },
                                    bonusLogos = iconsForCard.second.any { icon -> icon == "logos" },
                                    bonusMars = iconsForCard.second.any { icon -> icon == "mars" },
                                    bonusSkyborn = iconsForCard.second.any { icon -> icon == "skyborn" },
                                )
                            }
                        }
                    )
                }
        )
    }

    fun toDeck(copyIntoDeck: Deck? = null, token: Card? = null): Deck {
        val deck = copyIntoDeck?.copy(
            keyforgeId = id,
            name = name,
            expansion = expansion,
            powerLevel = power_level,
            chains = chains,
            wins = wins,
            losses = losses,
        )
            ?: Deck(
                keyforgeId = id,
                name = name,
                expansion = expansion,
                powerLevel = power_level,
                chains = chains,
                wins = wins,
                losses = losses,
            )

        return if (token != null) {
            deck.copy(tokenNumber = DokCardCacheService.tokenIdFromName(token.cardTitle))
        } else {
            deck
        }
    }
}
