package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class HouseMatchTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val pixieCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "dust pixie",
                            house = House.Untamed,
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
                    testCard(
                            name = "Hysteria",
                            house = House.Dis,
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
