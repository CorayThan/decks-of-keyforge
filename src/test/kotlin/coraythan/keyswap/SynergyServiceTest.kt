package coraythan.keyswap

import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.ExtraCardInfo
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.decks.models.Deck
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.synergy.DeckSynergyService
import coraythan.keyswap.synergy.SynTraitType
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import org.junit.Assert.assertEquals
import org.junit.Test
import org.slf4j.LoggerFactory

fun basicCard() = Card(
        "",
        "Tremor",
        House.Brobnar,
        CardType.Action,
        "",
        "",
        0,
        0,
        "0",
        0,
        "0",
        Rarity.Common,
        null,
        "001",
        1,
        Expansion.CALL_OF_THE_ARCHONS,
        false,
        false,
        extraCardInfo = ExtraCardInfo(

        )
)

class SynergyServiceTest {

    private val log = LoggerFactory.getLogger(this::class.java)

    val boringDeck = Deck(
            keyforgeId = "",
            expansion = 1,
            name = "boring",
            houseNamesString = "Brobnar|Sanctum|Untamed"
    )

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

    val hasOnlySynergies = listOf<Card>()
            .plus((0..11).map {
                basicCard().copy(
                        id = "returns creatures to hand",
                        extraCardInfo = ExtraCardInfo(
                                traits = listOf(
                                        SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 4)
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
                                        SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 4)
                                )
                        )
                )
            })

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
                                            SynTraitValue(SynergyTrait.highCreatureCount, 3, SynTraitType.house),
                                            SynTraitValue(SynergyTrait.lowCreatureCount, -3, SynTraitType.house),
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 4, SynTraitType.house),
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 2, SynTraitType.outOfHouse)
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
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 4)
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
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 4)
                                    ))
                    )
            )

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
                            traits = setOf("Beast"),
                            extraCardInfo = ExtraCardInfo(
                                    effectivePower = 4
                            )
                    )
            )
            .plus((0..1).map {
                basicCard().copy(
                        id = "niffle queen",
                        house = House.Untamed,
                        traits = setOf("Niffle"),
                        cardTitle = "Niffle Queen",
                        extraCardInfo = ExtraCardInfo(
                                effectivePower = 6,
                                effectivePowerMax = 12.0,
                                synergies = listOf(
                                        SynTraitValue(SynergyTrait.niffle, 3),
                                        SynTraitValue(SynergyTrait.beast, 3)
                                )
                        )
                )
            })

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
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 3, SynTraitType.outOfHouse),
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 3, SynTraitType.house)
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
                                            SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 4)
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
                                        SynTraitValue(SynergyTrait.returnsFriendlyCreaturesToHand, 2, SynTraitType.house)
                                )
                        )
                )
            )


    val jammerPack = listOf<Card>()
            .plus(
                    basicCard().copy(
                            id = "jammerpack",
                            house = House.Brobnar,
                            cardTitle = "jammerpack",
                            power = 75,
                            extraCardInfo = ExtraCardInfo(
                                    amberControl = 0.0,
                                    amberControlMax = 4.0,
                                    synergies = listOf(
                                            SynTraitValue(SynergyTrait.highTotalCreaturePower, 3)
                                    )
                            )
                    )
            )

    @Test
    fun testDecks() {

        assertEquals(36, basicDeckCards.size)

        val synergyResults = DeckSynergyService.fromDeckWithCards(boringDeck, basicDeckCards)
        assertEquals(36, synergyResults.synergyCombos.map { it.expectedAmber * it.copies }.sum().toInt())
        assertEquals(0, synergyResults.synergyRating.toInt())
        assertEquals(0, synergyResults.antisynergyRating.toInt())

        val niffleResults = DeckSynergyService.fromDeckWithCards(boringDeck, queenCards)
        assertEquals(3, niffleResults.synergyCombos.size)
        assertEquals(1, niffleResults.synergyRating)

        val huntingResults = DeckSynergyService.fromDeckWithCards(boringDeck, huntingWitch)
        assertEquals(0, huntingResults.synergyRating)

        val hasOnlySynergiesResults = DeckSynergyService.fromDeckWithCards(boringDeck, hasOnlySynergies)
        assertEquals(36, hasOnlySynergiesResults.synergyRating)
        assertEquals(36, hasOnlySynergiesResults.sasRating)
        assertEquals(0, hasOnlySynergiesResults.rawAerc)
    }

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
        assertEquals(SynTraitType.house, synergy?.type)
        assertEquals("hysteria", synergy?.traitCards?.first())
        assertEquals(5.28, combo.aercScore, 0.001)
    }

    @Test
    fun testJammerpack() {
        val jammerpack = DeckSynergyService.fromDeckWithCards(boringDeck.copy(totalPower = 75), jammerPack)
        assertEquals(2, jammerpack.synergyRating)
        assertEquals(2.0, jammerpack.amberControl, 0.001)
    }
}
