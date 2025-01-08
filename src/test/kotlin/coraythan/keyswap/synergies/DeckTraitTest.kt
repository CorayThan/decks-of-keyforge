package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert
import org.junit.Test
import org.slf4j.LoggerFactory

class DeckTraitTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val jammerPack = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "jammerpack",
                            house = House.Brobnar,
                            power = 65,
                            extraCardInfo = ExtraCardInfo(
                                    amberControl = 0.0,
                                    amberControlMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.totalCreaturePower, 3)
                                    )
                            )
                    )
            )

    @Test
    fun testJammerpack() {
        val jammerpack = DeckSynergyService.fromDeckWithCards(boringDeck, jammerPack)

        Assert.assertEquals(2, jammerpack.synergyRating)
        Assert.assertEquals(2.0, jammerpack.amberControl, 0.001)

        val combos = jammerpack.synergyCombos[0].synergies
        log.info("Combos: $combos")
        Assert.assertEquals(50, combos[0].percentSynergized)
    }
}
