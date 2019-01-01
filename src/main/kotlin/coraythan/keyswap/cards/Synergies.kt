package coraythan.keyswap.cards

import java.util.*
import javax.persistence.Entity
import javax.persistence.Id

@Entity
data class SynTraitValue(
            val trait: SynTrait,
            val rating: Int = 2,
            val type: SynTraitType = SynTraitType.card,

            @Id
            val id: UUID = UUID.randomUUID()
)

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
    itself,

    // Traits (these don't need to be traits on the extra info
    knight,
    human,
    scientist,
    niffle,
    beast,

    // Special cards
    libraryAccess,
    badPenny,
    dextre,
    routineJob,
    urchin,
    ancientBear,

    // Deck / House traits
    highTotalCreaturePower,
    lowTotalCreaturePower,
    highCreatureCount, // 6=0, 7=1/4, 8=1/2, 9,10=3/4, 11,12=1
    lowCreatureCount, // 6=0, 5=1/4, 4=1/2, 3,2=3/4, 1,0=1
    powerfulCreatures,
    power4OrHigherCreatures,
    power3OrLowerCreatures,
    power3OrHigherCreatures,
    power2OrLowerCreatures,
    highArtifactCount,
    lowArtifactCount,
    expectedAmber,
    hasMars,
    highTotalArmor,
}

enum class SynTraitType {
    card,
    deck,
    house,
    outsideHouse
}
