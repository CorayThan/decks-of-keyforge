export interface SynTraitValue {
    trait: string
    rating: number
    type: string
    id: string
}

// export enum SynTrait {
//
//     // Amber / keys
//     capturesAmberOnEnemies = "capturesAmberOnEnemies",
//     capturesAmber = "capturesAmber",
//     stealsAmber = "stealsAmber",
//     increasesKeyCost = "increasesKeyCost",
//
//     // Damage
//     damagesMultipleEnemies = "damagesMultipleEnemies",
//     damagesAllEnemies = "damagesAllEnemies",
//     damagesFriendlyCreatures = "damagesFriendlyCreatures",
//     dealsDamage = "dealsDamage",
//     preventsDamage = "preventsDamage",
//
//     // Creatures
//     destroysFriendlyCreatures = "destroysFriendlyCreatures",
//     destroysEnemyCreatures = "destroysEnemyCreatures",
//     causesFighting = "causesFighting",
//     stuns = "stuns",
//     protectsCreatures = "protectsCreatures",
//     increasesCreaturePower = "increasesCreaturePower",
//     heals = "heals",
//     controlsCreatures = "controlsCreatures",
//     goodReap = "goodReap",
//     goodAction = "goodAction",
//     goodPlay = "goodPlay",
//     goodFight = "goodFight",
//     readiesCreatures = "readiesCreatures",
//     sacrificesCreatures = "sacrificesCreatures",
//     elusive = "elusive",
//     skirmish = "skirmish",
//     poison = "poison",
//
//     // Purging
//     purgesEnemyCreatures = "purgesEnemyCreatures",
//     purgesFriendlyCreatures = "purgesFriendlyCreatures",
//
//     // Archives
//     archives = "archives",
//     archivesEnemyCards = "archivesEnemyCards",
//
//     // Discard
//     returnsCreaturesFromDiscard = "returnsCreaturesFromDiscard",
//     returnsCardsFromDiscard = "returnsCardsFromDiscard",
//
//     // Artifacts
//     destroysEnemyArtifacts = "destroysEnemyArtifacts",
//     destroysFriendlyArtifacts = "",
//     usableArtifact = "",
//
//     // Hand Manipulation
//     discardsEnemyCards = "",
//     reducesEnemyDraw = "",
//     returnsFriendlyCreaturesToHand = "",
//     returnsEnemyCreaturesToHand = "",
//     returnsFriendlyArtifactsToHand = "",
//     returnsEnemyArtifactsToHand = "",
//     drawsCards = "",
//     increasesHandSize = "",
//     playsCards = "",
//     revealsHand = "",
//
//     // Houses
//     controlsHouseChoice = "",
//     usesCreaturesOutOfHouse = "",
//
//     // other
//     revealsTopDeck = "",
//     chains = "",
//     forgesKeys = "",
//
//     // Traits (these don't need to be traits on the extra info
//     knight = "",
//     human = "",
//     scientist = "",
//     niffle = "",
//     beast = "",
//
//     // Special cards
//     dominatorBauble = "",
//     libraryAccess = "",
//     badPenny = "",
//     dextre = "",
//     routineJob = "",
//     urchin = "",
//     ancientBear = "",
//
//     // Deck traits
//     lowTotalCreaturePower, // 60-=1/4, 56-=1/2, 51-=3/4, 46-=1
//     power5OrHigherCreatures, // 6+=1/4, 7+=1/2, 8+=3/4, 10+=1
//     power4OrHigherCreatures, // 9+=1/4, 10+=1/2, 11+=3/4, 13+=1
//     power3OrHigherCreatures, // 13+=1/4, 14+=1/2, 15+=3/4, 17+=1
//     power3OrLowerCreatures, // 9+=1/4, 10+=1/2, 11+=3/4, 12+=1
//     power2OrLowerCreatures, // 4+=1/4, 5+=1/2, 6+=3/4, 7+=1
//     highArtifactCount, // 4=0, 5=1/4, 6=1/2, 7=3/4, 8+=1
//     lowArtifactCount, // 4=0, 3=1/4, 2=1/2, 1=3/4, 0=1
//     hasMars,
//     highTotalArmor, // 4=1/4, 5=1/2, 7=3/4, 9=1
//
//     // Deck or House only traits
//     highTotalCreaturePower, // for house: 22+=1/4, 24+=1/2, 26+=3/4, 28+=1
//     // for deck: 68+=1/4, 73+=1/2, 78+=3/4, 84+=1
//
//     highCreatureCount, // for house: =<6=0, 7=1/4, 8=1/2, 9 =3/4, 10,11,12=1
//     // for deck: 17+=1/4, 18+=1/2, 19+=3/4, 21+=1
//
//     lowCreatureCount, // for house: =>6=0, 5=1/4, 4=1/2, 3=3/4, 2,1,0=1
//     // for deck: 16-=1/4, 15-=1/2, 14-=3/4, 13-=1
// }
