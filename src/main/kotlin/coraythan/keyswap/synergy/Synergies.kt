package coraythan.keyswap.synergy

import coraythan.keyswap.cards.CardTrait
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
) : Comparable<SynTraitValue> {
    override fun compareTo(other: SynTraitValue): Int {
        return other.rating - this.rating
    }

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
    damagesAllEnemies,
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
    goodPlay,
    goodFight,
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

    // Traits (these don't need to be traits on the extra info)
    knight,
    human,
    scientist,
    niffle,
    beast,

    // Special cards
    badPenny,
    routineJob,
    urchin,
    ancientBear,

    // Deck traits
    lowTotalCreaturePower, // 60-=1/4, 56-=1/2, 51-=3/4, 46-=1
    power5OrHigherCreatures, // 6+=1/4, 7+=1/2, 8+=3/4, 10+=1
    power4OrHigherCreatures, // 9+=1/4, 10+=1/2, 11+=3/4, 13+=1
    power3OrHigherCreatures, // 13+=1/4, 14+=1/2, 15+=3/4, 17+=1
    power3OrLowerCreatures, // 9+=1/4, 10+=1/2, 11+=3/4, 12+=1
    power2OrLowerCreatures, // 4+=1/4, 5+=1/2, 6+=3/4, 7+=1
    highArtifactCount, // 4=0, 5=1/4, 6=1/2, 7=3/4, 8+=1
    lowArtifactCount, // 4=0, 3=1/4, 2=1/2, 1=3/4, 0=1
    hasMars,
    highTotalArmor, // 4=1/4, 5=1/2, 7=3/4, 9=1

    // Deck or House only traits
    highTotalCreaturePower, // for house: 22+=1/4, 24+=1/2, 26+=3/4, 28+=1
    // for deck: 68+=1/4, 73+=1/2, 78+=3/4, 84+=1

    highCreatureCount, // for house: =<6=0, 7=1/4, 8=1/2, 9 =3/4, 10,11,12=1
    // for deck: 17+=1/4, 18+=1/2, 19+=3/4, 21+=1

    lowCreatureCount, // for house: =>6=0, 5=1/4, 4=1/2, 3=3/4, 2,1,0=1
    // for deck: 16-=1/4, 15-=1/2, 14-=3/4, 13-=1
}

enum class SynTraitType {
    anyHouse,
    // Only synergizes with traits inside its house
    house,
}
