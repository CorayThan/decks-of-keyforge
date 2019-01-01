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
    dealsAoeDamage,
    dealsDamage,

    // Creatures
    destroysFriendlyCreatures,
    destroysEnemyCreatures,
    causesFighting,
    stuns,
    protectsCreatures,
    increasesCreaturePower,
    elusive,
    skirmish,
    heals,
    controlsCreatures,
    highValueReap,
    highValueAction,
    readiesCreatures,

    // Purging
    purgesEnemyCreatures,
    purgesFriendlyCreatures,

    // Archives
    archivesFriendlyCards,
    archivesEnemyCards,

    // Discard
    returnsCreaturesFromDiscard,

    // Artifacts
    destroysArtifacts,
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

    // Special cards
    libraryAccess,
    badPenny,
    dextre,

    // Deck / House traits
    highTotalCreaturePower,
    lowTotalCreaturePower,
    highCreatureCount,
    lowCreatureCount,
    powerfulCreatures,
    weakCreatures,
    power4OrHigherCreatures,
    power3OrLowerCreatures,
    power3OrHigherCreatures,
    power2OrLowerCreatures,
    highArtifactCount,
    lowArtifactCount,
    expectedAmber,
    hasMars,
    highTotalArmor
}

enum class SynTraitType {
    card,
    deck,
    house,
    outsideHouse
}
