package coraythan.keyswap.synergies

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.synergy.*
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory
import kotlin.math.roundToInt

class BasicSynsTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val basicDeckCards = listOf<Card>()
            .plus((0..11).map {
                basicCard().copy(
                        id = "tremor",
                        extraCardInfo = ExtraCardInfo(
                                creatureControl = 1.0
                        )
                )
            })
            .plus((0..11).map {
                basicCard().copy(
                        id = "virtuous works",
                        house = House.Sanctum,
                        cardTitle = "Virtuous Works",
                        amber = 3,
                        extraCardInfo = ExtraCardInfo(
                                expectedAmber = 3.0
                        )
                )
            })
            .plus((0..11).map {
                basicCard().copy(
                        id = "niffle ape",
                        house = House.Untamed,
                        cardTitle = "Niffle Ape",
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

    val huntingWitch = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "hunting-witch",
                            house = House.Untamed,
                            cardTitle = "Hunting Witch",
                            cardType = CardType.Creature,
                            extraCardInfo = ExtraCardInfo(
                                    expectedAmber = 1.0,
                                    expectedAmberMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.highCreatureCount, 3, SynTraitHouse.house),
                                            SynTraitValue(SynergyTrait.lowCreatureCount, -3, SynTraitHouse.house),
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4, SynTraitHouse.house, player = SynTraitPlayer.FRIENDLY, cardTypesString = "Creature"),
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 2, SynTraitHouse.outOfHouse, player = SynTraitPlayer.FRIENDLY, cardTypesString = "Creature")
                                    ))
                    )
            )
            .plus((0..2).map {
                basicCard().copy(
                        id = "snufflegator",
                        house = House.Untamed,
                        cardTitle = "Snufflegator",
                        cardType = CardType.Creature,
                        extraCardInfo = ExtraCardInfo(
                        )
                )
            })
            .plus(
                    basicCard().copy(
                            id = "nature's call",
                            house = House.Untamed,
                            cardTitle = "Nature's Call",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4, cardTypesString = "Creature")
                                    ))
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "hysteria",
                            house = House.Sanctum,
                            cardTitle = "Hysteria",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4, cardTypesString = "Creature")
                                    ))
                    )
            )

    @Test
    fun testHuntingWitch() {

        val huntingResults = DeckSynergyService.fromDeckWithCards(boringDeck, huntingWitch, null)
        assertEquals(0, huntingResults.synergyRating)
        assertEquals(2.875, huntingResults.expectedAmber, 0.001)
        val combos = huntingResults.synergyCombos.find { it.cardName == "Hunting Witch" }!!.synergies
        log.info("Combos: $combos")
        assertEquals(50, combos.find { it.traitCards.contains("Nature's Call") }!!.percentSynergized)
        assertEquals(25, combos.find { it.traitCards.contains("Hysteria") }!!.percentSynergized)
        assertEquals(-50, combos.find { it.trait.trait == SynergyTrait.lowCreatureCount }!!.percentSynergized)
    }

    val basicSynAndAntisyn = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "hunting-witch",
                            house = House.Untamed,
                            cardTitle = "Hunting Witch",
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
                    basicCard().copy(
                            id = "nature's call",
                            house = House.Untamed,
                            cardTitle = "Nature's Call",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                    ))
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "gateway to dis",
                            house = House.Sanctum,
                            cardTitle = "gateway to dis",
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
        assertEquals(2, basicSynAntisynResults.sasRating - basicSynAntisynResults.metaScores.values.sum().roundToInt())
        assertEquals(2, basicSynAntisynResults.rawAerc)
    }

    val hasOnlySynergies = listOf<Card>()
            .plus((0..11).map {
                basicCard().copy(
                        id = "returns creatures to hand",
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                )
                        )
                )
            })
            .plus((0..11).map {
                basicCard().copy(
                        id = "liked being returned to hand",
                        house = House.Sanctum,
                        cardTitle = "Virtuous Works",
                        amber = 3,
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
        assertEquals(36, hasOnlySynergiesResults.synergyRating)
        // 28 due to meta score
        assertEquals(28, hasOnlySynergiesResults.sasRating)
        assertEquals(0, hasOnlySynergiesResults.rawAerc)
    }

    val hasOnlyAntisynergies = listOf<Card>()
            .plus((0..11).map {
                basicCard().copy(
                        id = "returns creatures to hand",
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                )
                        )
                )
            })
            .plus((0..11).map {
                basicCard().copy(
                        id = "hates being returned to hand",
                        house = House.Sanctum,
                        cardTitle = "hates being returned to hand",
                        amber = 3,
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
        assertEquals(0, hasOnlySynergiesResults.sasRating - hasOnlySynergiesResults.metaScores.values.sum().roundToInt())
        assertEquals(36, hasOnlySynergiesResults.rawAerc)
    }

    val shoolerHyseriaKeyA = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "shooler",
                            house = House.Sanctum,
                            cardTitle = "shooler",
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
                    basicCard().copy(
                            id = "hysteria",
                            house = House.Sanctum,
                            cardTitle = "hysteria",
                            extraCardInfo = ExtraCardInfo(
                                    traits = listOf(
                                            SynTraitValue(SynergyTrait.returns_R_ToHand, 4)
                                    )
                            )
                    )
            )
            .plus(
                    basicCard().copy(
                            id = "key abuduction",
                            house = House.Brobnar,
                            cardTitle = "key abuduction",
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
        assertEquals(5, shooler.sasRating - shooler.metaScores.values.sum().roundToInt())
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

    val spiritsWayCards = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "spirits way",
                            house = House.Sanctum,
                            cardTitle = "spirits way",
                            extraCardInfo = ExtraCardInfo(
                                    creatureControl = 0.0,
                                    creatureControlMax = 10.0,
                                    synergies = listOf(
                                            SynTraitValue(
                                                    SynergyTrait.any,
                                                    -1,
                                                    cardTypesInitial = listOf(CardType.Creature),
                                                    powersString = "3+"
                                            ),
                                    ),
                                    baseSynPercent = 180
                            )
                    )
            )
            .plus((0..9).map {
                basicCard().copy(
                        id = "beef",
                        house = House.Sanctum,
                        cardTitle = "beef",
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

    val selfSynergy = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "kirby",
                            house = House.Brobnar,
                            cardTitle = "kirby",
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

    val selfSynergyInHouse = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "kirby",
                            house = House.Brobnar,
                            cardTitle = "kirby",
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
                        basicCard().copy(
                                id = "kirby",
                                house = House.StarAlliance,
                                cardTitle = "kirby",
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
        val twoKirby = DeckSynergyService.fromDeckWithCards(boringDeck, selfSynergyInHouse)
        assertEquals(1.0, twoKirby.synergyCombos.find { it.cardName == "kirby" }!!.netSynergy, 0.001)
        assertEquals(5.0, twoKirby.efficiency, 0.001)
    }
}
