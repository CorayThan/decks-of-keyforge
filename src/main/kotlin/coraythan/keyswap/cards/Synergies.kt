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
    causesFighting,
    playsArtifacts,
    capturesAmberOnEnemies,
    capturesAmber,
    destroysCreatures,
    dealsAoeDamage,
    dealsDamage,
    causesStun,
    protectsCreatures,
    increasesKeyCost,
    hasPlayEffect,
    sacrificesCreatures,
    increasesCreaturePower,
    allowsUse,
    elusive,
    controlsHouseChoice,
    unsummonsOpponentsCreatures,
    destroysFriendlyCreatures,

    // Deck / House traits
    highTotalCreaturePower,
    lowTotalCreaturePower,
    highCreatureCount,
    lowCreatureCount,
    powerfulCreatures,
    power3OrHigherCreatures,
    power2OrLowerCreatures,
    expectedAmber
}

enum class SynTraitType {
    card,
    deck,
    house,
    outsideHouse
}
