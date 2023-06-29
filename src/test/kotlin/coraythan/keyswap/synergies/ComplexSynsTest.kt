package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class ComplexSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)


    val grumpBuggy = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "grump-buggy",
                            house = House.Brobnar,
                            cardTitle = "Grump Buggy",
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
                basicCard().copy(
                        id = "Troll",
                        house = House.Brobnar,
                        cardTitle = "Troll",
                        cardType = CardType.Creature,
                        power = 8,
                        powerString = "8"
                )
            })
            .plus((0..2).map {
                basicCard().copy(
                        id = "Bumpsy",
                        house = House.Brobnar,
                        cardTitle = "Bumpsy",
                        cardType = CardType.Creature,
                        power = 5,
                        powerString = "5"
                )
            })

    val binateRupture = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "binate-rupture",
                            house = House.Logos,
                            cardTitle = "Binate Rupture",
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
                basicCard().copy(
                        id = "IG",
                        house = House.Logos,
                        cardTitle = "IG",
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
            .plus(basicCard().copy(
                    id = "Alpha",
                    house = House.Logos,
                    cardTitle = "Alpha",
                    cardType = CardType.Creature,
                    power = 8,
                    powerString = "8",
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
