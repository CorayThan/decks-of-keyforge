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

class OwnTraitSynTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val ringOfInvisibility = listOf<DokCardInDeck>()
        .plus(
            testCard(
                name = "Ring of Invisibility",
                house = House.Shadows,
                cardType = CardType.Upgrade,
                extraCardInfo = ExtraCardInfo(
                    other = 0.0,
                    otherMax = 10.0,
                    traits = listOf(
                        SynTraitValue(SynergyTrait.goodFight, rating = 3)
                    ),
                    synergies = listOf(
                        SynTraitValue(SynergyTrait.goodFight, rating = 3)
                    )
                )
            )
        )

    @Test
    fun testNoSelfSynergy() {
        val ringResults = DeckSynergyService.fromDeckWithCards(boringDeck, ringOfInvisibility)
        assertEquals(0.0, ringResults.other, 0.01)
        assertEquals(0, ringResults.sasRating)
        assertEquals(
            listOf<String>().toString(),
            ringResults.synergyCombos.first { it.cardName == "Ring of Invisibility" }.synergies.flatMap { it.traitCards }.toString()
        )
    }

}
