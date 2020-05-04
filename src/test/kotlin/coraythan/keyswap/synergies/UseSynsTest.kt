package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class UseSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val queenCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "niffle ape",
                            house = House.Untamed,
                            traits = setOf("Niffle"),
                            cardTitle = "Niffle Ape",
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 3
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "snufflegator",
                            house = House.Untamed,
                            cardTitle = "Snufflegator",
                            traits = setOf("BEAST"),
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 4
                            )
                    )
            )
            .plus((0..1).map {
                basicCard().copy(
                        id = "niffle queen",
                        house = House.Untamed,
                        traits = setOf("NIFFLE"),
                        cardTitle = "Niffle Queen",
                        extraCardInfo = ExtraCardInfo(
                                effectivePower = 6,
                                effectivePowerMax = 12.0,
                                synergies = listOf(
                                        SynTraitValue(SynergyTrait.any, 3, cardTraitsString = "NIFFLE"),
                                        SynTraitValue(SynergyTrait.any, 3, cardTraitsString = "BEAST")
                                )
                        )
                )
            })

    @Test
    fun testNiffles() {

        val niffleResults = DeckSynergyService.fromDeckWithCards(boringDeck, queenCards)
        assertEquals(3, niffleResults.synergyCombos.size)
        assertEquals(1, niffleResults.synergyRating)
    }

}
