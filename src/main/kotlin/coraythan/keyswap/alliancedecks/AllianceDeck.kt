package coraythan.keyswap.alliancedecks

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import coraythan.keyswap.*
import coraythan.keyswap.cards.Card
import coraythan.keyswap.decks.models.*
import coraythan.keyswap.stats.DeckStatistics
import coraythan.keyswap.synergy.DeckSynergyInfo
import coraythan.keyswap.synergy.SynTraitPlayer
import coraythan.keyswap.synergy.SynergyTrait
import coraythan.keyswap.synergy.containsTrait
import coraythan.keyswap.users.KeyUser
import org.hibernate.annotations.Type
import java.time.LocalDate
import java.time.ZonedDateTime
import java.util.*
import javax.persistence.*

@Entity
data class AllianceDeck(

    override val name: String,
    override val expansion: Int,

    override val rawAmber: Int = 0,
    override val totalPower: Int = 0,
    override val bonusDraw: Int = 0,
    override val bonusCapture: Int = 0,
    override val creatureCount: Int = 0,
    override val actionCount: Int = 0,
    override val artifactCount: Int = 0,
    override val upgradeCount: Int = 0,
    override val totalArmor: Int = 0,

    override val expectedAmber: Double = 0.0,
    override val amberControl: Double = 0.0,
    override val creatureControl: Double = 0.0,
    override val artifactControl: Double = 0.0,
    override val efficiency: Double = 0.0,
    override val recursion: Double = 0.0,
    override val effectivePower: Int = 0,
    override val creatureProtection: Double = 0.0,
    override val disruption: Double = 0.0,
    override val other: Double = 0.0,
    override val aercScore: Double = 0.0,
    override val previousSasRating: Int? = 0,
    override val previousMajorSasRating: Int? = 0,
    override val aercVersion: Int? = 0,
    override val sasRating: Int = 0,
    override val synergyRating: Int = 0,
    override val antisynergyRating: Int = 0,

    val validAlliance: Boolean = true,
    val createdDateTime: ZonedDateTime? = now(),

    // Json of card ids for performance loading decks, loading cards from cache
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    override val cardIds: String = "",
    override val tokenId: String? = null,

    override val cardNames: String = "",

    override val houseNamesString: String = "",

    override val bonusIconsString: String? = null,

    @JsonIgnoreProperties("allianceDeck")
    @OneToMany(mappedBy = "allianceDeck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val allianceHouses: List<AllianceHouse> = listOf(),

    val housesUniqueId: String = "",

    val public: Boolean = false,

    @JsonIgnoreProperties("deck")
    @OneToMany(mappedBy = "deck", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val ownedDecks: List<OwnedAllianceDeck> = listOf(),

    @ManyToOne()
    val discoverer: KeyUser,

    val checkedUniqueness: Boolean = false,

    @Id
    val id: UUID = UUID.randomUUID()

) : GenericDeck {

    companion object {

        val restrictedCardsList = mapOf(
            "Control the Weak" to 100,
            "Dark Æmber Vault" to 1,
            "Ghostform" to 100,
            "Library Access" to 1,
            "Martian Generosity" to 100,
            "Restringuntus" to 1,
            "Sci. Officer Morpheus" to 100,
            "Scrambler Storm" to 100,
            "Stealth Mode" to 100,
            "Timetraveller" to 100,
            "United Action" to 100,
        )

        fun determineIfValid(cards: List<Card>): Boolean {
            val restrictedCards = cards
                .filter { restrictedCardsList.containsKey(it.cardTitle) }
                .groupBy { it.cardTitle }
                .map { it.key to it.value.size }

            if (restrictedCards.size > 1) return false
            if (restrictedCards.any { it.second > (restrictedCardsList[it.first] ?: 0) }) return false
            return true
        }

        fun uniqueHousesId(housesAndDeckIds: List<Pair<House, String>>): String {
            val sorted = housesAndDeckIds.sortedBy { it.first }
            val toJoin = sorted.map { "${it.first}::${it.second}" }
            return toJoin.joinToString("&&")
        }

        fun fromDeck(deck: Deck, cards: List<Card>, discoverer: KeyUser): AllianceDeck {
            return AllianceDeck(
                name = deck.name,
                expansion = deck.expansion,

                rawAmber = deck.rawAmber,
                totalPower = deck.totalPower,
                bonusDraw = deck.bonusDraw ?: 0,
                bonusCapture = deck.bonusCapture ?: 0,
                creatureCount = deck.creatureCount,
                actionCount = deck.actionCount,
                artifactCount = deck.artifactCount,
                upgradeCount = deck.upgradeCount,
                totalArmor = deck.totalArmor,

                expectedAmber = deck.expectedAmber,
                amberControl = deck.amberControl,
                creatureControl = deck.creatureControl,
                artifactControl = deck.artifactControl,
                efficiency = deck.efficiency,
                recursion = deck.recursion,
                effectivePower = deck.effectivePower,
                creatureProtection = deck.creatureProtection,
                disruption = deck.disruption,
                other = deck.other,
                aercScore = deck.aercScore,
                aercVersion = deck.aercVersion,
                sasRating = deck.sasRating,
                synergyRating = deck.synergyRating,
                antisynergyRating = deck.antisynergyRating,

                cardIds = deck.cardIds,
                cardNames = deck.cardNames,
                houseNamesString = deck.houseNamesString,
                bonusIconsString = deck.bonusIconsString,
                discoverer = discoverer,
                validAlliance = determineIfValid(cards),
            )
        }
    }

    val dateAdded: LocalDate?
        get() = this.createdDateTime?.toLocalDate()

    override fun toDeckSearchResult(
        housesAndCards: List<HouseAndCards>?,
        cards: List<Card>?,
        stats: DeckStatistics?,
        synergies: DeckSynergyInfo?,
        includeDetails: Boolean,
        token: Card?,
    ): DeckSearchResult {

        return DeckSearchResult(
            deckType = DeckType.ALLIANCE,
            validAlliance = if (cards == null) validAlliance else determineIfValid(cards),
            keyforgeId = id.toString(),
            expansion = expansionEnum,
            name = name,

            creatureCount = creatureCount.zeroToNull(),
            actionCount = actionCount.zeroToNull(),
            artifactCount = artifactCount.zeroToNull(),
            upgradeCount = upgradeCount.zeroToNull(),

            cardDrawCount = (cards?.filter {
                it.extraCardInfo?.traits?.containsTrait(SynergyTrait.drawsCards) == true
                        || it.extraCardInfo?.traits?.containsTrait(SynergyTrait.increasesHandSize) == true
            }?.size ?: 0).zeroToNull(),
            cardArchiveCount = (cards?.filter {
                it.extraCardInfo?.traits?.containsTrait(
                    SynergyTrait.archives,
                    player = SynTraitPlayer.FRIENDLY
                ) == true
            }?.size
                ?: 0).zeroToNull(),
            keyCheatCount = (cards?.filter { it.extraCardInfo?.traits?.containsTrait(SynergyTrait.forgesKeys) == true }?.size
                ?: 0).zeroToNull(),
            rawAmber = rawAmber,
            totalArmor = totalArmor.zeroToNull(),

            expectedAmber = synergies?.expectedAmber ?: expectedAmber,
            amberControl = synergies?.amberControl ?: amberControl,
            creatureControl = synergies?.creatureControl ?: creatureControl,
            artifactControl = (synergies?.artifactControl ?: artifactControl).zeroToNull(),
            efficiency = (synergies?.efficiency ?: efficiency).zeroToNull(),
            recursion = (synergies?.recursion ?: recursion).zeroToNull(),
            effectivePower = synergies?.effectivePower ?: effectivePower,
            creatureProtection = (synergies?.creatureProtection ?: creatureProtection).zeroToNull(),
            disruption = (synergies?.disruption ?: disruption).zeroToNull(),
            other = (synergies?.other ?: other).zeroToNull(),
            aercScore = synergies?.rawAerc ?: aercScore.toInt(),
            previousSasRating = previousSasRating ?: sasRating,
            previousMajorSasRating = previousMajorSasRating,
            aercVersion = aercVersion ?: 12,
            sasRating = synergies?.sasRating ?: sasRating,
            synergyRating = synergies?.synergyRating ?: synergyRating,
            antisynergyRating = synergies?.antisynergyRating ?: antisynergyRating,
            totalPower = totalPower,
            housesAndCards = housesAndCards?.addBonusIcons(bonusIcons()) ?: listOf(),
            tokenInfo = if (token == null) null else TokenInfo(token.id, token.cardTitle, token.house),

            sasPercentile = stats?.sasStats?.percentileForValue?.get(synergies?.sasRating ?: sasRating)
                ?: if (sasRating < 75) 0.0 else 100.0,

            synergyDetails = if (includeDetails) synergies?.synergyCombos else synergies?.synergyCombos?.map {
                it.copy(
                    synergies = listOf()
                )
            },
            metaScores = synergies?.metaScores ?: mapOf(),
            efficiencyBonus = synergies?.efficiencyBonus ?: 0.0,
            allianceHouses = allianceHouses.map {
                AllianceHouseInfo(
                    keyforgeId = it.keyforgeId,
                    house = it.house,
                    name = it.name,
                )
            },
            dateAdded = dateAdded,
            discoveredBy = discoverer.username,
            )
    }
}
