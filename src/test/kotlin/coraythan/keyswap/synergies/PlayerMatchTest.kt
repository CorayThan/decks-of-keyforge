package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitPlayer
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class PlayerMatchTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val ctwCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "Control the Weak",
                            house = House.Dis,
                            cardTitle = "Control the Weak",
                            extraCardInfo = ExtraCardInfo(
                                    disruption = 1.5,
                                    disruptionMax = 2.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.destroys, cardTypesInitial = listOf(CardType.Creature), rating = 3, player = SynTraitPlayer.ENEMY)
                                    )
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "Gateway to Dis",
                            house = House.Dis,
                            cardTitle = "Gateway to Dis",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.destroys, cardTypesInitial = listOf(CardType.Creature), rating = 3)
                                    )
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "Obsidian Forge",
                            house = House.Dis,
                            cardTitle = "Obsidian Forge",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.destroys, player = SynTraitPlayer.FRIENDLY, cardTypesInitial = listOf(CardType.Creature), rating = 3)
                                    )
                            )
                    )
            )

    @Test
    fun testCTWGateway() {

        val ctwResults = DeckSynergyService.fromDeckWithCards(boringDeck, ctwCards)
        assertEquals(1.625, ctwResults.disruption, 0.001)
    }

}
