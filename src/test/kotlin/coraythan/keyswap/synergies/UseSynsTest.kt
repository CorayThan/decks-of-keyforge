package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.*
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class UseSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val woteCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "wote",
                            house = House.Untamed,
                            cardTitle = "wote",
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
                    basicCard().copy(
                            id = "dominator bauble",
                            house = House.Dis,
                            cardTitle = "dominator bauble",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(SynTraitValue(SynergyTrait.uses, house = SynTraitHouse.outOfHouse, cardTypesInitial = listOf(CardType.Creature)))
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "hand of dis",
                            house = House.Dis,
                            cardTitle = "hand of dis",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(SynTraitValue(SynergyTrait.destroys, player = SynTraitPlayer.ENEMY, cardTypesInitial = listOf(CardType.Creature)))
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "commander remiel",
                            house = House.Sanctum,
                            cardTitle = "commander remiel",
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
