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

class ComplexSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)


    val grumpBuggy = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "grump-buggy",
                            house = House.Brobnar,
                            cardType = CardType.Artifact,
                            extraCardInfo = ExtraCardInfo(
                                    amberControl = 0.0,
                                    amberControlMax = 4.0,
                                    baseSynPercent = -50,
                                    synergies = listOf(
                                            SynTraitValue(
                                                    SynergyTrait.any,
                                                    1,
                                                    powersString = "5+",
                                            )
                                    ))
                    )
            )
            .plus((0..6).map {
                testCard(
                        name = "Troll",
                        house = House.Brobnar,
                        cardType = CardType.Creature,
                        power = 8,
                )
            })
            .plus((0..2).map {
                testCard(
                        name = "Bumpsy",
                        house = House.Brobnar,
                        cardType = CardType.Creature,
                        power = 5,
                )
            })

    val binateRupture = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "binate-rupture",
                            house = House.Logos,
                            cardType = CardType.Artifact,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 0.0,
                                    expectedAmberMax = 4.0,
                                    baseSynPercent = 25,
                                    synergies = listOf(
                                            SynTraitValue(
                                                    SynergyTrait.scalingAmberControl,
                                                    3,
                                                    house = SynTraitHouse.house
                                            ),
                                            SynTraitValue(
                                                    SynergyTrait.alpha,
                                                    -3,
                                                    house = SynTraitHouse.house
                                            ),
                                    ))
                    )
            )
            .plus((0..1).map {
                testCard(
                        name = "IG",
                        house = House.Logos,
                        cardType = CardType.Action,
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(
                                                SynergyTrait.scalingAmberControl,
                                                3,
                                        ),
                                ))
                )
            })
            .plus(testCard(
                    name = "Alpha",
                    house = House.Logos,
                    cardType = CardType.Creature,
                    power = 8,
                    extraCardInfo = ExtraCardInfo(
                            traits = listOf(
                                    SynTraitValue(
                                            SynergyTrait.alpha,
                                            3,
                                    ),
                            ))
            ))

    @Test
    fun testGrumpBuggy() {

        // First 50% doesn't count
        val grumpyResults = DeckSynergyService.fromDeckWithCards(boringDeck, grumpBuggy)
        assertEquals(2, grumpyResults.synergyRating)
        assertEquals(2.0, grumpyResults.amberControl, 0.001)
    }

    @Test
    fun testBinateRupture() {

        // Starts at 1, has +50% minus 25%, so 25% synergy. Needs 75% to get to 4
        val ruptureResults = DeckSynergyService.fromDeckWithCards(boringDeck, binateRupture)
        assertEquals(1, ruptureResults.synergyRating)
        assertEquals(2.0, ruptureResults.expectedAmber, 0.001)
    }

}
