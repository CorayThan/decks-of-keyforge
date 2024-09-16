package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitPlayer
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class UseSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val woteCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "wote",
                            house = House.Untamed,
                            extraCardInfo = ExtraCardInfo(
                                    efficiency = 1.0,
                                    efficiencyMax = 3.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.causesReaping, rating = 3)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "dominator bauble",
                            house = House.Dis,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(SynTraitValue(SynergyTrait.uses, house = SynTraitHouse.outOfHouse, cardTypes = listOf(CardType.Creature)))
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "hand of dis",
                            house = House.Dis,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(SynTraitValue(SynergyTrait.destroys, player = SynTraitPlayer.ENEMY, cardTypes = listOf(CardType.Creature)))
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "commander remiel",
                            house = House.Sanctum,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(SynTraitValue(SynergyTrait.causesReaping, house = SynTraitHouse.outOfHouse))
                            )
                    )
            )

    @Test
    fun testWote() {

        val results = DeckSynergyService.fromDeckWithCards(boringDeck, woteCards)
        assertEquals(2.0, results.efficiency, 0.001)
        assertEquals(1.0, results.synergyCombos.find { it.cardName == "wote" }!!.netSynergy, 0.001)
    }

}
