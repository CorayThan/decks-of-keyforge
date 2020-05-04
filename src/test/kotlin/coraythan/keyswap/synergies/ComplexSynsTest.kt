package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.DeckSynergyService
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
                                    synergies = listOf(
                                            SynTraitValue(
                                                    SynergyTrait.any,
                                                    1,
                                                    powersString = "5+",
                                                    baseSynPercent = -50
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

    @Test
    fun testGrumpBuggy() {

        // First 50% doesn't count
        val grumpyResults = DeckSynergyService.fromDeckWithCards(boringDeck, grumpBuggy)
        assertEquals(2, grumpyResults.synergyRating)
        assertEquals(2.0, grumpyResults.amberControl, 0.001)
    }

}
