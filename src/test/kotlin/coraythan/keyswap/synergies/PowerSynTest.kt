package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class PowerSynTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val poisonWaveCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "Poison Wave",
                            house = House.StarAlliance,
                            cardType = CardType.Action,
                            extraCardInfo = ExtraCardInfo(
                                    creatureControl = 1.0,
                                    creatureControlMax = 2.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.any, rating = -1, powersString = "2 or less")
                                    )
                            )
                    )
            )
            .plus((0..1).map {
                testCard(
                        name = "power 2 creature",
                        house = House.Untamed,
                        power = 2,
                        cardType = CardType.Creature
                )
            })
            .plus((0..1).map {
                testCard(
                        name = "power 3 creature",
                        house = House.Untamed,
                        power = 3,
                        cardType = CardType.Creature
                )
            })
            .plus((0..1).map {
                testCard(
                        name = "artifact",
                        house = House.Untamed,
                        cardType = CardType.Artifact
                )
            })

    @Test
    fun testPoisonWave() {

        val poisonResults = DeckSynergyService.fromDeckWithCards(boringDeck, poisonWaveCards)
        assertEquals(1.8, poisonResults.creatureControl, 0.01)
    }

}
