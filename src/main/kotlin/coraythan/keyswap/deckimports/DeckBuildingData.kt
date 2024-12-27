package coraythan.keyswap.deckimports

import coraythan.keyswap.House
import coraythan.keyswap.decks.models.BonusIconHouse
import coraythan.keyswap.decks.models.BonusIconsCard
import coraythan.keyswap.decks.models.DeckBonusIcons
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs

data class DeckBuildingData(
    val cards: Map<House, List<TheoryCard>>,
    val name: String,
    val expansion: Expansion = Expansion.CALL_OF_THE_ARCHONS,
    val tokenTitle: String?,
    val alliance: Boolean = false,
) {
    val bonusIcons = DeckBonusIcons(
        cards.entries
            .map { houses ->
                BonusIconHouse(
                    house = houses.key,
                    bonusIconCards = houses.value
                        .map { theoryCard ->
                            BonusIconsCard(
                                cardTitle = theoryCard.name,
                                bonusAember = theoryCard.bonusAember,
                                bonusCapture = theoryCard.bonusCapture,
                                bonusDamage = theoryCard.bonusDamage,
                                bonusDraw = theoryCard.bonusDraw,
                                bonusDiscard = theoryCard.bonusDiscard,
                                bonusBobnar = theoryCard.bonusBobnar,
                                bonusDis = theoryCard.bonusDis,
                                bonusEkwidon = theoryCard.bonusEkwidon,
                                bonusGeistoid = theoryCard.bonusGeistoid,
                                bonusLogos = theoryCard.bonusLogos,
                                bonusMars = theoryCard.bonusMars,
                                bonusSkyborn = theoryCard.bonusSkyborn,
                            )
                        }
                )
            })
}

@GenerateTs
data class TheoryCard(
    val name: String,
    val enhanced: Boolean = false,
    val bonusAember: Int = 0,
    val bonusCapture: Int = 0,
    val bonusDamage: Int = 0,
    val bonusDraw: Int = 0,
    val bonusDiscard: Int = 0,
    val bonusBobnar: Boolean = false,
    val bonusDis: Boolean = false,
    val bonusEkwidon: Boolean = false,
    val bonusGeistoid: Boolean = false,
    val bonusLogos: Boolean = false,
    val bonusMars: Boolean = false,
    val bonusSkyborn: Boolean = false,
)
