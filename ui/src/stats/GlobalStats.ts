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
}
