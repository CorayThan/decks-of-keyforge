package coraythan.keyswap.decks.models

import coraythan.keyswap.roundToTwoSigDig
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
    val creatureCount: Int,
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
    constructor(deck: Deck) : this(
        name = deck.name,
        expansion = deck.expansion,
        maverickCount = deck.maverickCount,
        rawAmber = deck.rawAmber,
        bonusDraw = deck.bonusDraw ?: 0,
        bonusCapture = deck.bonusCapture ?: 0,
        creatureCount = deck.creatureCount,
        actionCount = deck.actionCount,
        artifactCount = deck.artifactCount,
        upgradeCount = deck.upgradeCount,
        tokenNumber = deck.tokenNumber,
        cardNames = deck.cardNames,
        houseNamesString = deck.houseNamesString,
        importDateTime = deck.importDateTime,

        // Indexed SAS values
        expectedAmber = deck.expectedAmber,
        amberControl = deck.amberControl,
        creatureControl = deck.creatureControl,
        artifactControl = deck.artifactControl,
        efficiency = deck.efficiency,
        recursion = deck.recursion,
        effectivePower = deck.effectivePower,
        disruption = deck.disruption,
        aercScore = deck.aercScore,
        aercVersion = deck.aercVersion,
        sasRating = deck.sasRating,
        synergyRating = deck.synergyRating,
        antisynergyRating = deck.antisynergyRating,

        // SAS Values w/out search indexing
        other = deck.other,
        creatureProtection = deck.creatureProtection,

        deck = deck,
        deckId = deck.id,
    )

    fun sasValuesChanged(deck: Deck): Boolean {
        
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
                this.aercScore.roundToTwoSigDig() == deck.aercScore.roundToTwoSigDig()
        
        // Indexed SAS values
        expectedAmber = deck.expectedAmber
        amberControl = deck.amberControl
        creatureControl = deck.creatureControl
        artifactControl = deck.artifactControl
        efficiency = deck.efficiency
        recursion = deck.recursion
        effectivePower = deck.effectivePower
        disruption = deck.disruption
        aercScore = deck.aercScore
        aercVersion = deck.aercVersion
        sasRating = deck.sasRating
        synergyRating = deck.synergyRating
        antisynergyRating = deck.antisynergyRating

        // SAS Values w/out search indexing
        other = deck.other
        creatureProtection = deck.creatureProtection

        return ratingsEqual
    }

}

@Entity
class DeckSasValuesSearchable(deck: Deck) : DeckSasValues(deck) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "deck_search_values_1_sequence")
    @SequenceGenerator(name = "deck_search_values_1_sequence", allocationSize = 1)
    val id: Long = -1
}

@Entity
class DeckSasValuesUpdatable(deck: Deck) : DeckSasValues(deck) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "deck_search_values_2_sequence")
    @SequenceGenerator(name = "deck_search_values_2_sequence", allocationSize = 1)
    val id: Long = -1
}
