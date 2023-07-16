package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.extrainfo.ExtraCardInfo
import coraythan.keyswap.synergy.synergysystem.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

class CardCountsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val pulpateCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "Technivore Pulpate",
                            house = House.StarAlliance,
                            cardTitle = "Technivore Pulpate",
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    artifactControl = 0.5,
                                    artifactControlMax = 1.5,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.any, cardTypesInitial = listOf(CardType.Artifact), rating = -2)
                                    )
                            )
                    )
            )
            .plus((0..1).map {
                basicCard().copy(
                        id = "artifact",
                        house = House.Untamed,
                        cardTitle = "artifact",
                        cardType = CardType.Artifact
                )
            })
            .plus((0..1).map {
                basicCard().copy(
                        id = "not an artifact",
                        house = House.Untamed,
                        cardTitle = "not an artifact",
                        cardType = CardType.Action
                )
            })

    @Test
    fun testPulpateArtifacts() {

        val pulpateResults = DeckSynergyService.fromDeckWithCards(boringDeck, pulpateCards)
        assertEquals(0, pulpateResults.antisynergyRating)
        assertEquals(1.2, pulpateResults.artifactControl, 0.01)
    }

}
