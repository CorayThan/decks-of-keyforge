package coraythan.keyswap.decks.models

import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.roundToTwoSigDig
import coraythan.keyswap.synergy.DeckSynergyInfo
import jakarta.persistence.*
import java.time.ZonedDateTime

@MappedSuperclass
abstract class DeckSasValues(

    // Deck Statistic indexed values that don't change
    val name: String,
    val expansion: Int,
    val maverickCount: Int,
    val rawAmber: Int,
    val bonusDraw: Int,
    val bonusCapture: Int,
    var creatureCount: Int,
    val actionCount: Int,
    val artifactCount: Int,
    val upgradeCount: Int,
    val tokenNumber: Int? = null,
    val cardNames: String = "",
    val houseNamesString: String = "",
    val importDateTime: ZonedDateTime?,

    // Indexed SAS values
    var sasRating: Int,
    var synergyRating: Int,
    var antisynergyRating: Int,
    var aercVersion: Int,
    var amberControl: Double,
    var expectedAmber: Double,
    var artifactControl: Double,
    var creatureControl: Double,
    var efficiency: Double,
    var recursion: Double,
    var disruption: Double,
    var effectivePower: Int,

    // SAS Values w/out search indexing
    var aercScore: Double,
    var other: Double,
    var creatureProtection: Double,


    @OneToOne(optional = false)
    @JoinColumn(name = "deck_id", insertable = false, updatable = false)
    val deck: Deck,

    @Column(name = "deck_id", nullable = false)
    val deckId: Long,

    ) {
    constructor(deck: Deck, cards: List<DokCardInDeck>, deckSyns: DeckSynergyInfo, sasVersion: Int) : this(
        name = deck.name,
        expansion = deck.expansion,
        maverickCount = cards.count { it.maverick },
        rawAmber = cards.sumOf { it.card.amber } + deck.bonusIcons().bonusIconHouses.sumOf { it.bonusIconCards.sumOf { it.bonusAember } },
        bonusDraw = deck.bonusIcons().bonusIconHouses.sumOf { it.bonusIconCards.sumOf { it.bonusDraw } },
        bonusCapture = deck.bonusIcons().bonusIconHouses.sumOf { it.bonusIconCards.sumOf { it.bonusCapture } },
        creatureCount = cards.count {
            !it.card.big && it.card.cardType == CardType.Creature
        } + cards.count {
            it.card.big && it.card.cardType == CardType.Creature
        }.div(2),
        actionCount = cards.count { it.card.cardType == CardType.Action },
        artifactCount = cards.count { it.card.cardType == CardType.Artifact },
        upgradeCount = cards.count { it.card.cardType == CardType.Upgrade },
        tokenNumber = deck.tokenNumber,
        cardNames = cards.genCardNamesIndexableString(),
        houseNamesString = deck.houseNamesString,
        importDateTime = deck.importDateTime,

        // Indexed SAS values
        expectedAmber = deckSyns.expectedAmber,
        amberControl = deckSyns.amberControl,
        creatureControl = deckSyns.creatureControl,
        artifactControl = deckSyns.artifactControl,
        efficiency = deckSyns.efficiency,
        recursion = deckSyns.recursion,
        effectivePower = deckSyns.effectivePower,
        disruption = deckSyns.disruption,
        aercScore = deckSyns.rawAerc.toDouble(),
        aercVersion = sasVersion,
        sasRating = deckSyns.sasRating,
        synergyRating = deckSyns.synergyRating,
        antisynergyRating = deckSyns.antisynergyRating,

        // SAS Values w/out search indexing
        other = deckSyns.other,
        creatureProtection = deckSyns.creatureProtection,

        deck = deck,
        deckId = deck.id,
    )

    fun sasValuesChanged(deck: DeckSynergyInfo, inputAercVersion: Int, cards: List<DokCardInDeck>): Boolean {

        val ratingsEqual = this.amberControl.roundToTwoSigDig() == deck.amberControl.roundToTwoSigDig() &&
                this.expectedAmber.roundToTwoSigDig() == deck.expectedAmber.roundToTwoSigDig() &&
                this.artifactControl.roundToTwoSigDig() == deck.artifactControl.roundToTwoSigDig() &&
                this.creatureControl.roundToTwoSigDig() == deck.creatureControl.roundToTwoSigDig() &&
                this.effectivePower == deck.effectivePower &&
                this.efficiency.roundToTwoSigDig() == deck.efficiency.roundToTwoSigDig() &&
                this.recursion.roundToTwoSigDig() == deck.recursion.roundToTwoSigDig() &&
                this.disruption.roundToTwoSigDig() == deck.disruption.roundToTwoSigDig() &&
                this.creatureProtection.roundToTwoSigDig() == deck.creatureProtection.roundToTwoSigDig() &&
                this.other.roundToTwoSigDig() == deck.other.roundToTwoSigDig() &&
                this.sasRating == deck.sasRating &&
                this.aercScore.roundToTwoSigDig() == deck.rawAerc.toDouble().roundToTwoSigDig()

        // Indexed SAS values
        expectedAmber = deck.expectedAmber
        amberControl = deck.amberControl
        creatureControl = deck.creatureControl
        artifactControl = deck.artifactControl
        efficiency = deck.efficiency
        recursion = deck.recursion
        effectivePower = deck.effectivePower
        disruption = deck.disruption
        aercScore = deck.rawAerc.toDouble()
        aercVersion = inputAercVersion
        sasRating = deck.sasRating
        synergyRating = deck.synergyRating
        antisynergyRating = deck.antisynergyRating

        // SAS Values w/out search indexing
        other = deck.other
        creatureProtection = deck.creatureProtection

        // TODO Remove this code after the next SAS update as all will be well
        val creatureCountRecalculated = cards.count {
            !it.card.big && it.card.cardType == CardType.Creature
        } + cards.count {
            it.card.big && it.card.cardType == CardType.Creature
        }.div(2)

        if (creatureCountRecalculated != creatureCount) {
            creatureCount = creatureCountRecalculated
            return true
        }

        return ratingsEqual
    }

}

@Entity
class DeckSasValuesSearchable(deck: Deck, cards: List<DokCardInDeck>, deckSyns: DeckSynergyInfo, sasVersion: Int) :
    DeckSasValues(deck, cards, deckSyns, sasVersion) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "deck_search_values_1_sequence")
    @SequenceGenerator(name = "deck_search_values_1_sequence", allocationSize = 1)
    val id: Long = -1
}

@Entity
class DeckSasValuesUpdatable(deck: Deck, cards: List<DokCardInDeck>, deckSyns: DeckSynergyInfo, sasVersion: Int) :
    DeckSasValues(deck, cards, deckSyns, sasVersion) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "deck_search_values_2_sequence")
    @SequenceGenerator(name = "deck_search_values_2_sequence", allocationSize = 1)
    val id: Long = -1
}
