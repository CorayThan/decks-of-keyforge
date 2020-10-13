package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonInclude
import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.roundToOneSigDig
import coraythan.keyswap.synergy.SynergyCombo
import java.time.LocalDate

// It takes a long time to load all the crap in hibernate, so avoid that.
@JsonInclude(JsonInclude.Include.NON_NULL)
data class DeckSearchResult(
        val id: Long = -1,
        val keyforgeId: String = "",
        val expansion: Expansion,

        val name: String = "",

        val creatureCount: Int? = null,
        val actionCount: Int? = null,
        val artifactCount: Int? = null,
        val upgradeCount: Int? = null,

        val powerLevel: Int? = null,
        val chains: Int? = null,
        val wins: Int? = null,
        val losses: Int? = null,

        val expectedAmber: Double = 0.0,
        val amberControl: Double = 0.0,
        val creatureControl: Double = 0.0,
        val artifactControl: Double? = null,
        val efficiency: Double? = null,
        val effectivePower: Int = 0,
        val creatureProtection: Double? = null,
        val disruption: Double? = null,
        val other: Double? = null,

        val aercScore: Int = 0,
        val previousSasRating: Int = 0,
        val previousMajorSasRating: Int? = null,
        val aercVersion: Int = 12,
        val sasRating: Int = 0,
        val synergyRating: Int = 0,
        val antisynergyRating: Int = 0,
        val adaptiveScore: Int = 0,
        val metaScores: Map<String, Int> = mapOf(),

        val totalPower: Int = 0,
        val cardDrawCount: Int? = null,
        val cardArchiveCount: Int? = null,
        val keyCheatCount: Int? = null,
        val rawAmber: Int = 0,
        val totalArmor: Int? = null,

        val forSale: Boolean? = null,
        val forTrade: Boolean? = null,
        val forAuction: Boolean? = null,
        val wishlistCount: Int? = null,
        val funnyCount: Int? = null,

        val lastSasUpdate: String? = null,
        val sasPercentile: Double = 0.0,

        val hasOwnershipVerification: Boolean? = null,

        val housesAndCards: List<HouseAndCards> = listOf(),
        val deckSaleInfo: List<DeckSaleInfo>? = null,
        val owners: List<String>? = null,
        val synergyDetails: List<SynergyCombo>? = null,
        val dateAdded: LocalDate? = null
) {

    fun printDeckSimple(): String {
        return "$sasRating SAS • ${expansion.readable} • ${housesAndCards.map { it.house }.joinToString(" – ") { it.masterVaultValue }}" +
                if (forSale == true || forAuction == true || forTrade == true) " • For sale" else ""
    }

    fun printDeck(): String {
        return """
            ${printDeckSimple()}
            
            ${if ((powerLevel ?: 0) > 0 || (chains ?: 0) > 0 || (wins ?: 0) > 0 || (losses ?: 0) > 0) "Power Level ${powerLevel ?: 0} • ${chains ?: 0} Chains • ${wins ?: 0} / ${losses ?: 0} OP Wins / Losses\n" else ""}
            ${amberControl.roundToOneSigDig()} Aember Control (A)
            ${expectedAmber.roundToOneSigDig()} Expected Aember (E)
            ${(artifactControl ?: 0.0).roundToOneSigDig()} Artifact Control (R)
            ${creatureControl.roundToOneSigDig()} Creature Control (C)
            ${(efficiency ?: 0.0).roundToOneSigDig()} Efficiency (F)
            ${(disruption ?: 0.0).roundToOneSigDig()} Disruption (D)
            
            $actionCount Actions
            $creatureCount Creatures
            $artifactCount Artifacts
            $upgradeCount Upgrades
        """.trimIndent()
    }

    fun toSimpleResult() = SimpleDeckSearchResult(
            name,
            keyforgeId,
            housesAndCards.map { it.house },
            sasRating
    )
}

@GenerateTs
data class SimpleDeckSearchResult(
        val name: String,
        val keyforgeId: String,
        val houses: List<House>,
        val sas: Int,
)
