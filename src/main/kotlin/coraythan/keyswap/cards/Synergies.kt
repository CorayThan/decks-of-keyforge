package coraythan.keyswap.cards

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class SynTraitValue(
            val trait: SynTrait,
            val rating: Int = 2,
            val type: SynTraitType = SynTraitType.anyHouse,

            @Id
            val id: UUID = UUID.randomUUID()
) {
    fun synergyValue(matches: Int): Double {
        return matches * when (rating) {
            -3 -> -0.5
            -2 -> -0.25
            -1 -> -0.125
            1 -> 0.125
            2 -> 0.25
            3 -> 0.5
            else -> throw IllegalStateException("Can't have synergy rating of $rating")
        }
    }
}

fun Set<CardTrait>.toSynTraits(): List<SynTrait> {
    return this.mapNotNull {
        when (it) {
            CardTrait.Beast -> SynTrait.beast
            CardTrait.Knight -> SynTrait.knight
            CardTrait.Human -> SynTrait.human
            CardTrait.Scientist -> SynTrait.scientist
            CardTrait.Niffle -> SynTrait.niffle
            else -> null
        }
    }
}

enum class SynTrait {

    // Amber / keys
    capturesAmberOnEnemies,
    capturesAmber,
    stealsAmber,
    increasesKeyCost,

    // Damage
    damagesMultipleEnemies,
    damagesFriendlyCreatures,
    dealsDamage,
    preventsDamage,

    // Creatures
    destroysFriendlyCreatures,
    destroysEnemyCreatures,
    causesFighting,
    stuns,
    protectsCreatures,
    increasesCreaturePower,
    heals,
    controlsCreatures,
    goodReap,
    goodAction,
    readiesCreatures,
    sacrificesCreatures,
    elusive,
    skirmish,
    poison,

    // Purging
    purgesEnemyCreatures,
    purgesFriendlyCreatures,

    // Archives
    archives,
    archivesEnemyCards,

    // Discard
    returnsCreaturesFromDiscard,
    returnsCardsFromDiscard,

    // Artifacts
    destroysEnemyArtifacts,
    destroysFriendlyArtifacts,
    usableArtifact,

    // Hand Manipulation
    discardsEnemyCards,
    reducesEnemyDraw,
    returnsFriendlyCreaturesToHand,
    returnsEnemyCreaturesToHand,
    returnsFriendlyArtifactsToHand,
    returnsEnemyArtifactsToHand,
    drawsCards,
    increasesHandSize,
    playsCards,
    revealsHand,

    // Houses
    controlsHouseChoice,
    usesCreaturesOutOfHouse,

    // other
    revealsTopDeck,
    chains,
    forgesKeys,

    // Traits (these don't need to be traits on the extra info
    knight,
    human,
    scientist,
    niffle,
    beast,

    // Special cards
    wardrummer,
    dominatorBauble,
    libraryAccess,
    badPenny,
    dextre,
    routineJob,
    urchin,
    ancientBear,

    // Deck / House traits
    highTotalCreaturePower,
    lowTotalCreaturePower,
    highCreatureCount, // =<6=0, 7=1/4, 8=1/2, 9,10=3/4, 11,12=1
    lowCreatureCount, // =>6=0, 5=1/4, 4=1/2, 3,2=3/4, 1,0=1
    powerfulCreatures,
    power4OrHigherCreatures,
    power3OrLowerCreatures,
    power3OrHigherCreatures,
    power2OrLowerCreatures,
    highArtifactCount, // 4=0, 5=1/4, 6=1/2, 7=3/4, 8+=1
    lowArtifactCount, // 4=0, 3=1/4, 2=1/2, 1=3/4, 0=1
    expectedAmber,
    hasMars,
    highTotalArmor,
}

enum class SynTraitType {
    anyHouse,
    // Only synergizes with traits inside its house
    house,
}
