import { BarData } from "./DeckStatsView"

export interface GlobalStats {
    averageActions: number
    averageArtifacts: number
    averageCreatures: number
    averageUpgrades: number
    averageExpectedAmber: number
    averageAmberControl: number
    averageCreatureControl: number
    averageArtifactControl: number
    sas: BarData[]
    cardsRating: BarData[]
    synergy: BarData[]
    antisynergy: BarData[]
    totalCreaturePower: BarData[]
    totalArmor: BarData[]
    amberControl: BarData[]
    expectedAmber: BarData[]
    artifactControl: BarData[]
    creatureControl: BarData[]

    creatures: BarData[]
    actions: BarData[]
    artifacts: BarData[]
    upgrades: BarData[]

    sasWinRate?: BarData[]
    cardRatingsWinRate?: BarData[]
    synergyWinRate?: BarData[]
    antisynergyWinRate?: BarData[]
    amberControlWinRate?: BarData[]
    expectedAmberWinRate?: BarData[]
    artifactControlWinRate?: BarData[]
    creatureControlWinRate?: BarData[]

    creatureCountWinRate?: BarData[]
    actionCountWinRate?: BarData[]
    artifactCountWinRate?: BarData[]
    upgradeCountWinRate?: BarData[]

    raresWinRate?: BarData[]
    houseWinRate?: BarData[]
}
