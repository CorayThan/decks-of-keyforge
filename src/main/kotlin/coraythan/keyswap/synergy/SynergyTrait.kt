package coraythan.keyswap.synergy

enum class TraitStrength(val value: Int) {
    STRONG(4),
    NORMAL(3),
    WEAK(2),
    EXTRA_WEAK(1)
}

fun Set<String>.toSynergies(): List<SynergyTrait> {
    return this.mapNotNull {
        SynergyTrait.fromTrait(it)
    }
}

enum class SynergyTrait {

    any,

    returnsFriendlyArtifactsToHand,

    exalt,

    damagesMultiple,

    destroys,

    moves,

    returns_R_ToHand,

    uses,

    purges,

    archives,

    controls,

    returns_R_FromDiscard,

    discardsCards,

    reduces_R_HandSize,


    // Amber / keys
    capturesAmberOnEnemies,
    capturesAmber,
    capturesOntoTarget,
    stealsAmber,
    increasesKeyCost,
    scalingSteal,
    spendsCapturedAmber,

    // Damage
    distributableDamage, // eg sack of coins, cooperative hunting
    dealsDamage,
    preventsDamage,

    // Creatures
    stuns,
    addsArmor,
    protectsCreatures,
    increasesCreaturePower,
    heals,
    causesFighting,
    causesReaping,
    sacrificesCreatures,

    // Keywords
    elusive,
    skirmish,
    poison,
    deploy,
    ward,

    // Archives
    archivesRandom,

    // Discard


    // Artifacts
    usableArtifact,

    // Hand Manipulation

    drawsCards,
    increasesHandSize,
    playsCards,
    revealsHand,
    shufflesDiscard,

    // Deck manip
    reorderDeck,

    // Playing
    dangerousRandomPlay,

    // Houses
    controlsHouseChoice,


    // other
    revealsTopDeck,
    chains,
    forgesKeys,


    alpha,
    omega,

    /*** Deprecated ***/

    goodReap,
    goodAction,
    goodPlay,
    goodFight,
    goodDestroyed,

    power5OrHigherCreatures, // 6+=1/4, 7+=1/2, 8+=3/4, 10+=1
    power4OrHigherCreatures, // 9+=1/4, 10+=1/2, 11+=3/4, 13+=1
    power3OrHigherCreatures, // 13+=1/4, 14+=1/2, 15+=3/4, 17+=1
    power3OrLowerCreatures, // 9+=1/4, 10+=1/2, 11+=3/4, 12+=1
    power2OrLowerCreatures, // 4+=1/4, 5+=1/2, 6+=3/4, 7
    power1Creatures, // 1=1/4, 2=1/2, 3=3/4, 4+=1
    upgradeCount, // for house or deck: 1+ = 1/4 2+ = 1/2 3+ = 3/4 4+ = 1
    highArtifactCount, // 4=0, 5=1/4, 6=1/2, 7=3/4, 8+=1
    lowArtifactCount, // 4=0, 3=1/4, 2=1/2, 1=3/4, 0=1

    /*** End Deprecated ***/

    // Deck traits In general these are 50 to 60 percentile = 0, 60+ = 1, 70+ = 2, 80+ = 3 90+ = 4 +=1
    hasMars,
    highTotalArmor, // 4=1/4, 5=1/2, 7=3/4, 9=1

    // Deck or House only traits
    highTotalCreaturePower, // for house: 22+=1/4, 24+=1/2, 26+=3/4, 28+=1
    // for deck: 68+=1/4, 73+=1/2, 78+=3/4, 84+=1
    lowTotalCreaturePower, // 60-=1/4, 56-=1/2, 51-=3/4, 46-=1

    // creature count has out-of-house numbers

    highCreatureCount, // for house: =<6=0, 7=1/4, 8=1/2, 9 =3/4, 10,11,12=1
    // for deck: 17+=1/4, 18+=1/2, 19+=3/4, 21+=1

    lowCreatureCount, // for house: =>6=0, 5=1/4, 4=1/2, 3=3/4, 2,1,0=1
    // for deck: 16-=1/4, 15-=1/2, 14-=3/4, 13-=1

    highExpectedAmber, // for house: 7=0, 8=1/4, 9=1/2, 10=3/4, 11=1
    // for deck: 22+=1/4, 24+=1/2, 26=3/4, 27+=1

    lowExpectedAmber, // for house: 7=0, 6=1/4, 5=1/2, 4=3/4, 3=1
    // for deck: 18-=1/4, 17-=1/2, 16-=3/4, 14-=1

    // Special traits
    card,
    // Automatically applied
    goodCreature;

    companion object {
        fun fromTrait(trait: String): SynergyTrait? {
            try {
                return valueOf(trait.toLowerCase())
            } catch (e: IllegalArgumentException) {
                return null
            }
        }
    }
}
