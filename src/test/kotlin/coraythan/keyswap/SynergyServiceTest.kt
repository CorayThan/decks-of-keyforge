package coraythan.keyswap

import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitType
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test

fun basicCard() = Card(
        "",
        "Tremor",
        House.Brobnar,
        CardType.Action,
        "",
        "",
        0,
        0,
        "0",
        0,
        "0",
        Rarity.Common,
        null,
        "001",
        1,
        Expansion.CALL_OF_THE_ARCHONS,
        false,
        extraCardInfo = ExtraCardInfo(

        )
)

class SynergyServiceTest {

    val boringDeck = Deck(
            keyforgeId = "",
            expansion = 1,
            name = "boring",
            houseNamesString = "Brobnar|Sanctum|Untamed"
    )

    val basicDeckCards = listOf<Card>()
            .plus((0..11).map {
                basicCard().copy(
                        id = "tremor",
                        extraCardInfo = ExtraCardInfo(
                                creatureControl = 1.0
                        )
                )
            })
            .plus((0..11).map {
                basicCard().copy(
                        id = "virtuous works",
                        house = House.Sanctum,
                        cardTitle = "Virtuous Works",
                        amber = 3,
                        extraCardInfo = ExtraCardInfo(
                                expectedAmber = 3.0
                        )
                )
            })
            .plus((0..11).map {
                basicCard().copy(
                        id = "niffle ape",
                        house = House.Untamed,
                        cardTitle = "Niffle Ape",
                        extraCardInfo = ExtraCardInfo(
                                effectivePower = 3
                        )
                )
            })

    val huntingWitch = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "hunting-witch",
                            house = House.Untamed,
                            cardTitle = "Hunting Witch",
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 1.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.highCreatureCount, 2, SynTraitType.house),
                                            SynTraitValue(SynergyTrait.lowCreatureCount, -2, SynTraitType.house),
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 3, SynTraitType.house),
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 1, SynTraitType.outOfHouse)
                                    ))
                    )
            )
            .plus((0..2).map {
                basicCard().copy(
                        id = "snufflegator",
                        house = House.Untamed,
                        cardTitle = "Snufflegator",
                        cardType = CardType.Creature,
                        extraCardInfo = ExtraCardInfo(
                        )
                )
            })
            .plus(
                    basicCard().copy(
                            id = "nature's call",
                            house = House.Untamed,
                            cardTitle = "Nature's Call",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 3)
                                    ))
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "hysteria",
                            house = House.Sanctum,
                            cardTitle = "Hysteria",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 3)
                                    ))
                    )
            )

    val queenCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "niffle ape",
                            house = House.Untamed,
                            traits = setOf("Niffle"),
                            cardTitle = "Niffle Ape",
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 3
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "snufflegator",
                            house = House.Untamed,
                            cardTitle = "Snufflegator",
                            traits = setOf("Beast"),
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 4
                            )
                    )
            )
            .plus((0..1).map {
                basicCard().copy(
                        id = "niffle queen",
                        house = House.Untamed,
                        traits = setOf("Niffle"),
                        cardTitle = "Niffle Queen",
                        extraCardInfo = ExtraCardInfo(
                                effectivePower = 6,
                                effectivePowerMax = 12.0,
                                synergies = listOf(
                                        SynTraitValue(SynergyTrait.niffle, 2),
                                        SynTraitValue(SynergyTrait.beast, 2)
                                )
                        )
                )
            })

    @Test
    fun testDecks() {

        assertEquals(36, basicDeckCards.size)

        val synergyResults = DeckSynergyService.fromDeckWithCards(boringDeck, basicDeckCards)
        assertEquals(36, synergyResults.synergyCombos.map { it.expectedAmber * it.copies }.sum().toInt())
        assertEquals(0, synergyResults.synergyRating.toInt())
        assertEquals(0, synergyResults.antisynergyRating.toInt())

        val niffleResults = DeckSynergyService.fromDeckWithCards(boringDeck, queenCards)
        assertEquals(3, niffleResults.synergyCombos.size)
        assertEquals(1, niffleResults.synergyRating)

        val huntingResults = DeckSynergyService.fromDeckWithCards(boringDeck, huntingWitch)
        assertEquals(0, huntingResults.synergyRating)
    }
}
