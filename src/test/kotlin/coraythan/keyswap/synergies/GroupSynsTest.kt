package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert
import org.junit.Test
import org.slf4j.LoggerFactory

class GroupSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val dustPixieNoKeyCheats = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "dust pixie",
                            house = House.Untamed,
                            cardTitle = "Dust Pixie",
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
                basicCard().copy(
                        id = "nature's call",
                        house = House.Untamed,
                        cardTitle = "Nature's Call",
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.replays, 3, cardTypesString = "Creature")
                                ))
                )
            })

    val dustPixieWithKeyCheats = dustPixieNoKeyCheats
            .plus((0..10).map {
                basicCard().copy(
                        id = "keycharge",
                        house = House.Untamed,
                        cardTitle = "keycharge",
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
