import { BarData } from "./DeckStatsView"

export interface GlobalStatsWithExpansion {
    expansion: number | null
    stats: GlobalStats
}

export interface GlobalStats {
    averageActions: number
    averageArtifacts: number
    averageCreatures: number
    averageUpgrades: number
    averageExpectedAmber: number
    averageAmberControl: number
    averageCreatureControl: number
    averageArtifactControl: number
    averageDeckManipulation: number
    averageEffectivePower: number
    sas: BarData[]
    cardsRating: BarData[]
    synergy: BarData[]
    antisynergy: BarData[]
    totalCreaturePower: BarData[]
    totalArmor: BarData[]
    aerc: BarData[]
    amberControl: BarData[]
    expectedAmber: BarData[]
    artifactControl: BarData[]
    creatureControl: BarData[]
    deckManipulation: BarData[]
    effectivePower: BarData[]

    creatures: BarData[]
    actions: BarData[]
    artifacts: BarData[]
    upgrades: BarData[]

    sasWinRate?: BarData[]
    cardRatingsWinRate?: BarData[]
    synergyWinRate?: BarData[]
    antisynergyWinRate?: BarData[]
    aercWinRate?: BarData[]
    amberControlWinRate?: BarData[]
    expectedAmberWinRate?: BarData[]
    artifactControlWinRate?: BarData[]
    creatureControlWinRate?: BarData[]
    deckManipulationWinRate?: BarData[]
    effectivePowerWinRate?: BarData[]

    creatureCountWinRate?: BarData[]
    actionCountWinRate?: BarData[]
    artifactCountWinRate?: BarData[]
    upgradeCountWinRate?: BarData[]

    raresWinRate?: BarData[]
    houseWinRate?: BarData[]
}
