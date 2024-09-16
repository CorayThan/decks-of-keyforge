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

class CardCountsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val pulpateCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "Technivore Pulpate",
                            house = House.StarAlliance,
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    artifactControl = 0.0,
                                    artifactControlMax = 10.0,
                                    synergies = listOf(
                                            SynTraitValue(
                                                SynergyTrait.any,

                                                cardTypes = listOf(CardType.Artifact),
                                                rating = 3
                                            )
                                    )
                            )
                    )
            )
            .plus((0..1).map {
                testCard(
                        name = "artifact",
                        house = House.Untamed,
                        cardType = CardType.Artifact,
                )
            })
            .plus((0..1).map {
                testCard(
                        name = "not an artifact",
                        house = House.Untamed,
                        cardType = CardType.Action
                )
            })

    @Test
    fun testPulpateArtifacts() {

        val pulpateResults = DeckSynergyService.fromDeckWithCards(boringDeck, pulpateCards)

        val combo = pulpateResults.synergyCombos.find { it.cardName == "Technivore Pulpate" }
        log.info("Found pulpate combo: ${combo}")

        // There are two artifact matches at normal strength
        assertEquals(50, combo?.synergies?.firstOrNull()?.percentSynergized)
        assertEquals(0, pulpateResults.antisynergyRating)
        assertEquals(5.0, pulpateResults.artifactControl, 0.01)
    }

}
