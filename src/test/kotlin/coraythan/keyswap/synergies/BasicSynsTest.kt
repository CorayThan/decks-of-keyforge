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

class BasicSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val basicDeckCards = listOf<DokCardInDeck>()
            .plus((0..11).map {
                testCard(
                        name = "tremor",
                        extraCardInfo = ExtraCardInfo(
                                creatureControl = 1.0
                        )
                )
            })
            .plus((0..11).map {
                testCard(
                        name = "virtuous works",
                        house = House.Sanctum,
                        amber = 3,
                        extraCardInfo = ExtraCardInfo(
                                expectedAmber = 3.0
                        )
                )
            })
            .plus((0..11).map {
                testCard(
                        name = "niffle ape",
                        house = House.Untamed,
                        extraCardInfo = ExtraCardInfo(
                                effectivePower = 3
                        )
                )
            })

    @Test
    fun testBoringDeck() {

        assertEquals(36, basicDeckCards.size)

        val synergyResults = DeckSynergyService.fromDeckWithCards(boringDeck, basicDeckCards, null)
        assertEquals(36, synergyResults.synergyCombos.map { it.expectedAmber * it.copies }.sum().toInt())
        assertEquals(0, synergyResults.synergyRating)
        assertEquals(0, synergyResults.antisynergyRating)

    }

    val huntingWitch = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "hunting-witch",
                            house = House.Untamed,
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 1.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.creatureCount, 3, SynTraitHouse.house),
                                              SynTraitValue(SynergyTrait.returns_R_ToHand, 4, SynTraitHouse.house, player = SynTraitPlayer.FRIENDLY, cardTypesString = "Creature"),
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 2, SynTraitHouse.outOfHouse, player = SynTraitPlayer.FRIENDLY, cardTypesString = "Creature")
                                    ))
                    )
            )
            .plus((0..2).map {
                testCard(
                        name = "snufflegator",
                        house = House.Untamed,
                        cardType = CardType.Creature,
                        extraCardInfo = ExtraCardInfo(
                        )
                )
            })
            .plus(
                    testCard(
                            name = "nature's call",
                            house = House.Untamed,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4, cardTypesString = "Creature")
                                    ))
                    )
            )
            .plus(
                    testCard(
                            name = "hysteria",
                            house = House.Sanctum,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4, cardTypesString = "Creature")
                                    ))
                    )
            )

    @Test
    fun testHuntingWitch() {

        val huntingResults = DeckSynergyService.fromDeckWithCards(boringDeck, huntingWitch, null)
        assertEquals(3, huntingResults.synergyRating)
        assertEquals(3.67, huntingResults.expectedAmber, 0.001)
        val combos = huntingResults.synergyCombos.find { it.cardName == "hunting-witch" }?.synergies ?: listOf()
        log.info("Combos: $combos")
        assertEquals(50, combos.find { it.traitCards.contains("nature's call") }?.percentSynergized)
        assertEquals(25, combos.find { it.traitCards.contains("hysteria") }?.percentSynergized)
        assertEquals(14, combos.find { it.trait.trait == SynergyTrait.creatureCount }?.percentSynergized)
    }

    val basicSynAndAntisyn = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "hunting-witch",
                            house = House.Untamed,
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 1.0,
                                    expectedAmberMax = 3.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4, SynTraitHouse.anyHouse),
                                            SynTraitValue(SynergyTrait.destroys, -4, SynTraitHouse.anyHouse)
                                    ))
                    )
            )
            .plus(
                    testCard(
                            name = "nature's call",
                            house = House.Untamed,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                    ))
                    )
            )
            .plus(
                    testCard(
                            name = "gateway to dis",
                            house = House.Sanctum,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.destroys, 4)
                                    ))
                    )
            )


    @Test
    fun testBasicSynAntisyn() {

        val basicSynAntisynResults = DeckSynergyService.fromDeckWithCards(boringDeck, basicSynAndAntisyn, null)
        assertEquals(0, basicSynAntisynResults.synergyRating)
        assertEquals(2, basicSynAntisynResults.sasRating)
        assertEquals(2, basicSynAntisynResults.rawAerc)
    }

    val hasOnlySynergies = listOf<DokCardInDeck>()
            .plus((0..11).map {
                testCard(
                        name = "returns creatures to hand",
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                )
                        )
                )
            })
            .plus((0..11).map {
                testCard(
                        name = "liked being returned to hand",
                        house = House.Sanctum,
                        extraCardInfo = ExtraCardInfo(
                                expectedAmber = 0.0,
                                expectedAmberMax = 3.0,
                                synergies = listOf(
                                        SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                )
                        )
                )
            })

    @Test
    fun testPureSynergies() {
        val hasOnlySynergiesResults = DeckSynergyService.fromDeckWithCards(boringDeck, hasOnlySynergies)
        log.info("Found synergy results for has only synergies: $hasOnlySynergiesResults")
        assertEquals(36, hasOnlySynergiesResults.synergyRating)
        assertEquals(36, hasOnlySynergiesResults.sasRating)
        assertEquals(0, hasOnlySynergiesResults.rawAerc)
    }

    val hasOnlyAntisynergies = listOf<DokCardInDeck>()
            .plus((0..11).map {
                testCard(
                        name = "returns creatures to hand",
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                )
                        )
                )
            })
            .plus((0..11).map {
                testCard(
                        name = "hates being returned to hand",
                        house = House.Sanctum,
                        extraCardInfo = ExtraCardInfo(
                                expectedAmber = 0.0,
                                expectedAmberMax = 3.0,
                                synergies = listOf(
                                        SynTraitValue(SynergyTrait.returns_R_ToHand, -4)
                                )
                        )
                )
            })

    @Test
    fun testPureAntisynergies() {
        val hasOnlySynergiesResults = DeckSynergyService.fromDeckWithCards(boringDeck, hasOnlyAntisynergies)
        assertEquals(0, hasOnlySynergiesResults.synergyRating)
        assertEquals(36, hasOnlySynergiesResults.antisynergyRating)
        assertEquals(0, hasOnlySynergiesResults.sasRating)
        assertEquals(36, hasOnlySynergiesResults.rawAerc)
    }

    val shoolerHyseriaKeyA = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "shooler",
                            house = House.Sanctum,
                            extraCardInfo = ExtraCardInfo(
                                    amberControl = 0.0,
                                    amberControlMax = 16.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 3, SynTraitHouse.outOfHouse),
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 3, SynTraitHouse.house)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "hysteria",
                            house = House.Sanctum,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                    )
                            )
                    )
            )
            .plus(
                    testCard(
                            name = "key abuduction",
                            house = House.Brobnar,
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 2, SynTraitHouse.house)
                                    )
                            )
                    )
            )

    @Test
    fun testShooler() {
        val shooler = DeckSynergyService.fromDeckWithCards(boringDeck, shoolerHyseriaKeyA)
        log.info("Combos: ${shooler.synergyCombos}")
        assertEquals(5, shooler.synergyRating)
        assertEquals(5, shooler.sasRating)
        assertEquals(0, shooler.rawAerc)
        assertEquals(5.28, shooler.amberControl, 0.001)
        val combo = shooler.synergyCombos.find { it.netSynergy > 0 }!!
        log.info("Found combo: $combo")
        assertEquals("shooler", combo.cardName)
        val synergy = combo.synergies.find { it.percentSynergized > 0 }
        assertEquals(SynTraitHouse.house, synergy?.trait?.house)
        assertEquals("hysteria", synergy?.traitCards?.first())
        assertEquals(5.28, combo.aercScore, 0.001)
    }

    val spiritsWayCards = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "spirits way",
                            house = House.Sanctum,
                            extraCardInfo = ExtraCardInfo(
                                    creatureControl = 0.0,
                                    creatureControlMax = 10.0,
                                    synergies = listOf(
                                            SynTraitValue(
                                                    SynergyTrait.any,
                                                    -1,
                                                    cardTypes = listOf(CardType.Creature),
                                                    powersString = "3+"
                                            ),
                                    ),
                                    baseSynPercent = 180
                            )
                    )
            )
            .plus((0..9).map {
                testCard(
                        name = "beef",
                        house = House.Sanctum,
                        cardType = CardType.Creature,
                        power = 3,
                )
            })

    @Test
    fun testSpiritsWay() {
        val spiritsWay = DeckSynergyService.fromDeckWithCards(boringDeck, spiritsWayCards)
        log.info("Spirits way details: $spiritsWay")
        assertEquals(8.0, spiritsWay.creatureControl, 0.001)
        assertEquals(-100, spiritsWay.synergyCombos.find { it.cardName == "spirits way" }?.synergies?.firstOrNull()?.percentSynergized)
    }

    val selfSynergy = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "kirby",
                            house = House.Brobnar,
                            power = 10,
                            extraCardInfo = ExtraCardInfo(
                                    efficiency = 0.0,
                                    efficiencyMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.card, 3, cardName = "kirby")
                                    )
                            )
                    )
            )

    @Test
    fun testSelfSynergy() {
        val kirby = DeckSynergyService.fromDeckWithCards(boringDeck, selfSynergy)
        assertEquals(0, kirby.synergyRating)
        assertEquals(0.0, kirby.efficiency, 0.001)

        val twoKirby = DeckSynergyService.fromDeckWithCards(boringDeck, selfSynergy.plus(selfSynergy))
        assertEquals(1.0, twoKirby.synergyCombos.find { it.cardName == "kirby" }!!.netSynergy, 0.001)
        assertEquals(2.0, twoKirby.efficiency, 0.001)
    }

    val selfSynergyInHouse = listOf<DokCardInDeck>()
            .plus(
                    testCard(
                            name = "kirby",
                            house = House.Brobnar,
                            power = 10,
                            extraCardInfo = ExtraCardInfo(
                                    efficiency = 1.0,
                                    efficiencyMax = 5.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.card, 3, cardName = "kirby", house = SynTraitHouse.house)
                                    )
                            )
                    )
            )
            .plus(
                    (0..1).map {
                        testCard(
                                name = "kirby",
                                house = House.StarAlliance,
                                power = 10,
                                extraCardInfo = ExtraCardInfo(
                                        efficiency = 1.0,
                                        efficiencyMax = 5.0,
                                        synergies = listOf(
                                                SynTraitValue(SynergyTrait.card, 3, cardName = "kirby", house = SynTraitHouse.house)
                                        )
                                )
                        )
                    }
            )

    @Test
    fun testSelfSynergyInHouse() {
        val twoKirby = DeckSynergyService.fromDeckWithCards(worldsCollideDeck, selfSynergyInHouse)
        assertEquals(1.0, twoKirby.synergyCombos.find { it.cardName == "kirby" && it.house == House.StarAlliance }!!.netSynergy, 0.001)
        assertEquals(0.0, twoKirby.synergyCombos.find { it.cardName == "kirby" && it.house == House.Brobnar }!!.netSynergy, 0.001)
        assertEquals(5.0, twoKirby.efficiency, 0.001)
    }
}
