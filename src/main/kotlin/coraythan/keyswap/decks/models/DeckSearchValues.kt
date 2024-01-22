package coraythan.keyswap.decks.models

import jakarta.persistence.*
import java.time.ZonedDateTime

@Entity
data class DeckSearchValues1(

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
    val sasRating: Int,
    val synergyRating: Int,
    val antisynergyRating: Int,
    val aercVersion: Int,
    val amberControl: Double,
    val expectedAmber: Double,
    val artifactControl: Double,
    val creatureControl: Double,
    val efficiency: Double,
    val recursion: Double,
    val disruption: Double,
    val effectivePower: Int,

    // SAS Values w/out search indexing
    val aercScore: Double,
    val other: Double,
    val creatureProtection: Double,

    // User modified values that change
    val forSale: Boolean = false,
    val forTrade: Boolean = false,
    val listedOn: ZonedDateTime? = null,

    @OneToOne(optional = false)
    @JoinColumn(name = "deck_id", insertable = false, updatable = false)
    val deck: Deck,

    @Column(name = "deck_id", nullable = false)
    val deckId: Long,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "deck_search_values_1_sequence")
    @SequenceGenerator(name = "deck_search_values_1_sequence", allocationSize = 1)
    val id: Long = -1
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

        // User modified values that change
        forSale = deck.forSale,
        forTrade = deck.forTrade,
        listedOn = deck.listedOn,

        deck = deck,
        deckId = deck.id,
    )
}

@Entity
data class DeckSearchValues2(

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
    val sasRating: Int,
    val synergyRating: Int,
    val antisynergyRating: Int,
    val aercVersion: Int,
    val amberControl: Double,
    val expectedAmber: Double,
    val artifactControl: Double,
    val creatureControl: Double,
    val efficiency: Double,
    val recursion: Double,
    val disruption: Double,
    val effectivePower: Int,

    // SAS Values w/out search indexing
    val aercScore: Double,
    val other: Double,
    val creatureProtection: Double,

    // User modified values that change
    val forSale: Boolean = false,
    val forTrade: Boolean = false,
    val listedOn: ZonedDateTime? = null,

    @OneToOne(optional = false)
    @JoinColumn(name = "deck_id", insertable = false, updatable = false)
    val deck: Deck,

    @Column(name = "deck_id", nullable = false)
    val deckId: Long,

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "deck_search_values_2_sequence")
    @SequenceGenerator(name = "deck_search_values_2_sequence", allocationSize = 1)
    val id: Long = -1
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

        // User modified values that change
        forSale = deck.forSale,
        forTrade = deck.forTrade,
        listedOn = deck.listedOn,

        deck = deck,
        deckId = deck.id,
    )
}
