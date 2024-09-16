package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class CardTraitsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val queenCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "niffle ape",
                            house = House.Untamed,
                            traits = setOf("Niffle"),
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 3
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "snufflegator",
                            house = House.Untamed,
                            traits = setOf("BEAST"),
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 4
                            )
                    )
            )
            .plus((0..1).map {
                testCard(
                        name = "niffle queen",
                        house = House.Untamed,
                        traits = setOf("NIFFLE"),
                        extraCardInfo = ExtraCardInfo(
                                effectivePower = 6,
                                effectivePowerMax = 12.0,
                                synergies = listOf(
                                        SynTraitValue(SynergyTrait.any, 3, cardTraits = listOf("NIFFLE")),
                                        SynTraitValue(SynergyTrait.any, 3, cardTraits = listOf("BEAST"))
                                )
                        )
                )
            })

    @Test
    fun testNiffles() {

        val niffleResults = DeckSynergyService.fromDeckWithCards(boringDeck, queenCards)
        assertEquals(3, niffleResults.synergyCombos.size)
        assertEquals(1, niffleResults.synergyRating)
    }

    val troopCallCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "niffle ape",
                            house = House.Untamed,
                            traits = setOf("NIFFLE"),
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 3
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "dust pixie",
                            house = House.Untamed,
                            cardType = CardType.Creature,
                            traits = setOf("FAERIE"),
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 1,
                                    expectedAmber = 0.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.replays, 3, cardTypes = listOf(CardType.Creature))
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "troop call",
                            house = House.Untamed,
                            cardType = CardType.Action,
                            extraCardInfo = ExtraCardInfo(
                                    other = 0.0,
                                    otherMax = 4.0,
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.replays, 3, cardTraits = listOf("NIFFLE"), cardTypes = listOf(CardType.Creature)),
                                    ),
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.any, 3, cardTraits = listOf("NIFFLE"), cardTypes = listOf(CardType.Creature)),
                                    )
                            )
                    )
            )

    @Test
    fun testTroopCall() {
        val troopResults = DeckSynergyService.fromDeckWithCards(boringDeck, troopCallCards)
        assertEquals(0.0, troopResults.synergyCombos.find { combo -> combo.cardName == "dust pixie" }?.expectedAmber ?: -100.0, 0.001)
        assertEquals(1.0, troopResults.synergyCombos.find { combo -> combo.cardName == "troop call" }?.other ?: -100.0, 0.001)
        assertEquals(1, troopResults.synergyRating)
    }

    val mutagenicCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "Subject Kirby",
                            house = House.StarAlliance,
                            traits = setOf("MUTANT"),
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    efficiency = 2.0,
                                    efficiencyMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.causesReaping, 4)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "Commander Chan",
                            house = House.StarAlliance,
                            traits = setOf("HUMAN"),
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 2.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.causesReaping, 4)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "Mutagenic Serum",
                            house = House.Logos,
                            cardType = CardType.Artifact,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(
                                                    SynergyTrait.uses,
                                                    4,
                                                    cardTypes = listOf(CardType.Creature),
                                                    house = SynTraitHouse.continuous,
                                                    cardTraits = listOf("MUTANT")
                                            )
                                    )
                            )
                    )
            )


    @Test
    fun testMutagenicSerum() {
        val mutagenicResults = DeckSynergyService.fromDeckWithCards(boringDeck, mutagenicCards)
        assertEquals(2.0, mutagenicResults.expectedAmber, 0.001)
        assertEquals(3.0, mutagenicResults.efficiency, 0.001)
    }

}
