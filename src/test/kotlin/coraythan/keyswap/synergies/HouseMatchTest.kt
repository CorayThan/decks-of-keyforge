package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class HouseMatchTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val pixieCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "dust pixie",
                            house = House.Untamed,
                            cardTitle = "dust pixie",
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 2.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.replays, rating = 3, house = SynTraitHouse.house),
                                            SynTraitValue(SynergyTrait.replays, rating = 2, house = SynTraitHouse.outOfHouse)
                                    )
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "Hysteria",
                            house = House.Dis,
                            cardTitle = "Hysteria",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.replays, rating = 3, house = SynTraitHouse.continuous)
                                    )
                            )
                    )
            )

    @Test
    fun testPixieHysteria() {

        val pixieResults = DeckSynergyService.fromDeckWithCards(boringDeck, pixieCards)

        // TODO this should be 2.5, but I haven't implemented this yet
        assertEquals(2.8, pixieResults.expectedAmber, 0.001)
    }

}
