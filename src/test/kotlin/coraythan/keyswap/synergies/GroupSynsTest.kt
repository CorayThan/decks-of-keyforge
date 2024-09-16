package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert
import org.junit.Test
import org.slf4j.LoggerFactory

class GroupSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val dustPixieNoKeyCheats = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "dust pixie",
                            house = House.Untamed,
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 2.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.replays, 3, synergyGroup = "A", synergyGroupMax = 75),
                                            SynTraitValue(SynergyTrait.forgesKeys, 3, SynTraitHouse.house, synergyGroup = "B", synergyGroupMax = 25)
                                    ))
                    )
            )
            .plus((0..10).map {
                testCard(
                        name = "nature's call",
                        house = House.Untamed,
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.replays, 3, cardTypesString = "Creature")
                                ))
                )
            })

    val dustPixieWithKeyCheats = dustPixieNoKeyCheats
            .plus((0..10).map {
                testCard(
                        name = "keycharge",
                        house = House.Untamed,
                        cardType = CardType.Action,
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.forgesKeys, 3)
                                )
                        )
                )
            })

    @Test
    fun testDustPixie() {

        val pixieNoCheatsResults = DeckSynergyService.fromDeckWithCards(boringDeck, dustPixieNoKeyCheats)
        Assert.assertEquals(2, pixieNoCheatsResults.synergyRating)
        Assert.assertEquals(3.5, pixieNoCheatsResults.expectedAmber, 0.001)

        val pixieWithCheatsResults = DeckSynergyService.fromDeckWithCards(boringDeck, dustPixieWithKeyCheats)
        Assert.assertEquals(2, pixieWithCheatsResults.synergyRating)
        Assert.assertEquals(4.0, pixieWithCheatsResults.expectedAmber, 0.001)
    }

}
