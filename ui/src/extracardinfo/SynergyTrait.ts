/* eslint-disable @typescript-eslint/camelcase */
import { startCase } from "lodash"
import { Utils } from "../config/Utils"

export enum SynergyTrait {

    any = "any",

    exalt = "exalt",

    damagesMultiple = "damagesMultiple",

    destroys = "destroys",

    moves = "moves",

    returns_R_ToHand = "returns_R_ToHand",

    uses = "uses",
    readies = "readies",

    purges = "purges",

    archives = "archives",

    controls = "controls",

    returns_R_FromDiscard = "returns_R_FromDiscard",

    discardsCards = "discardsCards",

    reduces_R_HandSize = "reduces_R_HandSize",

    // Amber / keys
    capturesAmberOnEnemies = "capturesAmberOnEnemies",
    capturesAmber = "capturesAmber",
    capturesOntoTarget = "capturesOntoTarget",
    stealsAmber = "stealsAmber",
    increasesKeyCost = "increasesKeyCost",
    scalingAmberControl = "scalingAmberControl",
    spendsCapturedAmber = "spendsCapturedAmber",

    // Damage
    dealsDamage = "dealsDamage",
    preventsDamage = "preventsDamage",
    distributableDamage = "distributableDamage",

    // Creatures
    stuns = "stuns",
    addsArmor = "addsArmor",
    protectsCreatures = "protectsCreatures",
    increasesCreaturePower = "increasesCreaturePower",
    heals = "heals",
    causesFighting = "causesFighting",
    causesReaping = "causesReaping",
    sacrificesCreatures = "sacrificesCreatures",
    elusive = "elusive",
    skirmish = "skirmish",
    poison = "poison",
    deploy = "deploy",
    ward = "ward",

    // Archives
    archivesRandom = "archivesRandom",

    // Artifacts
    usableArtifact = "usableArtifact",

    // Hand Manipulation
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


    // other
    revealsTopDeck = "revealsTopDeck",
    chains = "chains",
    forgesKeys = "forgesKeys",

    goodReap = "goodReap",
    goodAction = "goodAction",
    goodPlay = "goodPlay",
    goodFight = "goodFight",
    goodDestroyed = "goodDestroyed",
    regenerates = "regenerates",

    // Special traits, don't use these in manual traits
    alpha = "alpha",
    omega = "omega",

    // Deck traits In general these are 50 to 60 percentile = "0, 60+ = "1, 70+ = "2, 80+ = "3 90+ = "4
    hasMars = "hasMars",

    // Deck or House only traits
    upgradeCount = "upgradeCount",
    highTotalCreaturePower = "highTotalCreaturePower", // for house: 22+=1/4, 24+=1/2, 26+=3/4, 28+=1
    // for deck: 68+=1/4, 73+=1/2, 78+=3/4, 84+=1
    lowTotalCreaturePower = "lowTotalCreaturePower", // 60-=1/4, 56-=1/2, 51-=3/4, 46-=1
    highTotalArmor = "highTotalArmor", // 4=1/4, 5=1/2, 7=3/4, 9=1

    highArtifactCount = "highArtifactCount", // 4=0, 5=1/4, 6=1/2, 7=3/4, 8+=1
    lowArtifactCount = "lowArtifactCount", // 4=0, 3=1/4, 2=1/2, 1=3/4, 0=1
    highCreatureCount = "highCreatureCount", // for house: =<6=0, 7=1/4, 8=1/2, 9 =3/4, 10,11,12=1
    // for deck: 17+=1/4, 18+=1/2, 19+=3/4, 21+=1

    lowCreatureCount = "lowCreatureCount", // for house: =>6=0, 5=1/4, 4=1/2, 3=3/4, 2,1,0=1
    // for deck: 16-=1/4, 15-=1/2, 14-=3/4, 13-=1

    highExpectedAmber = "highExpectedAmber", // for house: 7=0, 8=1/4, 9=1/2, 10=3/4, 11=1
    // for deck: 22+=1/4, 24+=1/2, 26=3/4, 27+=1

    lowExpectedAmber = "lowExpectedAmber", // for house: 7=0, 6=1/4, 5=1/2, 4=3/4, 3=1

    goodCreature = "goodCreature",

    // no synergy traits
    card = "card",
}

const allSynergyTraits = Utils.enumValues(SynergyTrait) as SynergyTrait[]
const firstSpecialIndex = allSynergyTraits.indexOf(SynergyTrait.alpha)
export const specialTraits = allSynergyTraits.slice(firstSpecialIndex, allSynergyTraits.length)

export const noSynTraits = [SynergyTrait.card]

export const validSynergies = (Utils.enumValues(SynergyTrait) as string[])
export const validTraits = (Utils.enumValues(SynergyTrait) as string[])
    .filter(traitValue => !specialTraits.includes(traitValue as SynergyTrait))

export const traitOptions = validTraits.map(trait => ({label: startCase(trait).replace(" R ", " ??? "), value: trait}))
export const synergyOptions = validSynergies.map(trait => ({label: startCase(trait).replace(" R ", " ??? "), value: trait}))
