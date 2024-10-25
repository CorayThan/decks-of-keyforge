package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.SynTraitPlayer
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class PlayerMatchTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val ctwCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "Control the Weak",
                            house = House.Dis,
                            extraCardInfo = ExtraCardInfo(
                                    disruption = 1.5,
                                    disruptionMax = 2.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.destroys, cardTypes = listOf(CardType.Creature), rating = 3, player = SynTraitPlayer.ENEMY)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "Gateway to Dis",
                            house = House.Dis,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.destroys, cardTypes = listOf(CardType.Creature), rating = 3)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "Obsidian Forge",
                            house = House.Dis,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.destroys, player = SynTraitPlayer.FRIENDLY, cardTypes = listOf(CardType.Creature), rating = 3)
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
