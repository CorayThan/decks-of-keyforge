export enum SynergyTrait {

    // Amber / keys
    capturesAmberOnEnemies = "capturesAmberOnEnemies",
    capturesAmber = "capturesAmber",
    stealsAmber = "stealsAmber",
    increasesKeyCost = "increasesKeyCost",
    scalingSteal = "scalingSteal",
    exalt = "exalt",
    spendsCapturedAmber = "spendsCapturedAmber",

    // Damage
    damagesMultipleEnemies = "damagesMultipleEnemies",
    damagesAllEnemies = "damagesAllEnemies",
    damagesFriendlyCreatures = "damagesFriendlyCreatures",
    dealsDamage = "dealsDamage",
    preventsDamage = "preventsDamage",
    distributableDamage = "distributableDamage",

    // Creatures
    destroysFriendlyCreatures = "destroysFriendlyCreatures",
    destroysEnemyCreatures = "destroysEnemyCreatures",
    causesFighting = "causesFighting",
    causesReaping = "causesReaping",
    stuns = "stuns",
    addsArmor = "addsArmor",
    protectsCreatures = "protectsCreatures",
    increasesCreaturePower = "increasesCreaturePower",
    heals = "heals",
    controlsCreatures = "controlsCreatures",
    goodReap = "goodReap",
    goodAction = "goodAction",
    goodPlay = "goodPlay",
    goodFight = "goodFight",
    goodDestroyed = "goodDestroyed",
    readiesCreatures = "readiesCreatures",
    readiesCreaturesOnPlay = "readiesCreaturesOnPlay",
    sacrificesCreatures = "sacrificesCreatures",
    elusive = "elusive",
    skirmish = "skirmish",
    poison = "poison",
    deploy = "deploy",
    ward = "ward",

    // Purging
    purgesFriendlyCreatures = "purgesFriendlyCreatures",
    purges = "purges",

    // Archives
    archives = "archives",
    archivesRandom = "archivesRandom",
    archivesEnemyCards = "archivesEnemyCards",

    // Discard
    returnsCreaturesFromDiscard = "returnsCreaturesFromDiscard",
    returnsCardsFromDiscard = "returnsCardsFromDiscard",

    // Artifacts
    destroysEnemyArtifacts = "destroysEnemyArtifacts",
    destroysFriendlyArtifacts = "destroysFriendlyArtifacts",
    usableArtifact = "usableArtifact",

    // Hand Manipulation
    discardsFriendlyCards = "discardsFriendlyCards",
    discardsEnemyCards = "discardsEnemyCards",
    reducesEnemyDraw = "reducesEnemyDraw",
    returnsFriendlyCreaturesToHand = "returnsFriendlyCreaturesToHand",
    returnsEnemyCreaturesToHand = "returnsEnemyCreaturesToHand",
    returnsFriendlyArtifactsToHand = "returnsFriendlyArtifactsToHand",
    returnsEnemyArtifactsToHand = "returnsEnemyArtifactsToHand",
    drawsCards = "drawsCards",
    increasesHandSize = "increasesHandSize",
    playsCards = "playsCards",
    revealsHand = "revealsHand",
    shufflesDiscard = "shufflesDiscard",

    // deck manip
    reorderDeck = "reorderDeck",

    // Playing
    dangerousRandomPlay = "dangerousRandomPlay",

    // Houses
    controlsHouseChoice = "controlsHouseChoice",
    usesCreaturesOutOfHouse = "usesCreaturesOutOfHouse",

    // other
    revealsTopDeck = "revealsTopDeck",
    chains = "chains",
    forgesKeys = "forgesKeys",
    alpha = "alpha",
    omega = "omega",
    self = "self",

    // Traits (these don't need to be traits on the extra info)
    knight = "knight",
    human = "human",
    scientist = "scientist",
    niffle = "niffle",
    beast = "beast",
    thief = "thief",
    shard = "shard",
    wolf = "wolf",
    robot = "robot",

    // Special cards
    badPenny = "badPenny",
    routineJob = "routineJob",
    urchin = "urchin",
    ancientBear = "ancientBear",
    warGrumpus = "warGrumpus",
    ortannusBinding = "ortannusBinding",

    // Deck traits In general these are 50 to 60 percentile = "0, 60+ = "1, 70+ = "2, 80+ = "3 90+ = "4
    lowTotalCreaturePower = "lowTotalCreaturePower", // 60-=1/4, 56-=1/2, 51-=3/4, 46-=1
    power5OrHigherCreatures = "power5OrHigherCreatures", // 6+=1/4, 7+=1/2, 8+=3/4, 10+=1
    power4OrHigherCreatures = "power4OrHigherCreatures", // 9+=1/4, 10+=1/2, 11+=3/4, 13+=1
    power3OrHigherCreatures = "power3OrHigherCreatures", // 13+=1/4, 14+=1/2, 15+=3/4, 17+=1
    power3OrLowerCreatures = "power3OrLowerCreatures", // 9+=1/4, 10+=1/2, 11+=3/4, 12+=1
    power2OrLowerCreatures = "power2OrLowerCreatures", // 4+=1/4, 5+=1/2, 6+=3/4, 7+=1
    power1Creatures = "power1Creatures", // 1=1/4, 2=1/2, 3=3/4, 4+=1
    highArtifactCount = "highArtifactCount", // 4=0, 5=1/4, 6=1/2, 7=3/4, 8+=1
    lowArtifactCount = "lowArtifactCount", // 4=0, 3=1/4, 2=1/2, 1=3/4, 0=1
    hasMars = "hasMars",
    highTotalArmor = "highTotalArmor", // 4=1/4, 5=1/2, 7=3/4, 9=1

    // Deck or House only traits
    upgradeCount = "upgradeCount",
    highTotalCreaturePower = "highTotalCreaturePower", // for house: 22+=1/4, 24+=1/2, 26+=3/4, 28+=1
    // for deck: 68+=1/4, 73+=1/2, 78+=3/4, 84+=1

    highCreatureCount = "highCreatureCount", // for house: =<6=0, 7=1/4, 8=1/2, 9 =3/4, 10,11,12=1
    // for deck: 17+=1/4, 18+=1/2, 19+=3/4, 21+=1

    lowCreatureCount = "lowCreatureCount", // for house: =>6=0, 5=1/4, 4=1/2, 3=3/4, 2,1,0=1
    // for deck: 16-=1/4, 15-=1/2, 14-=3/4, 13-=1

    highExpectedAmber = "highExpectedAmber", // for house: 7=0, 8=1/4, 9=1/2, 10=3/4, 11=1
    // for deck: 22+=1/4, 24+=1/2, 26=3/4, 27+=1

    lowExpectedAmber = "lowExpectedAmber" // for house: 7=0, 6=1/4, 5=1/2, 4=3/4, 3=1
}
