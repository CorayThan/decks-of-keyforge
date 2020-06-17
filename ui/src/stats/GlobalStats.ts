import { BarData } from "../graphs/StatsBar"
import { AercData } from "./AercData"

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
    averageEfficiency: number
    averageDisruption: number
    averageCreatureProtection: number
    averageOther: number
    averageEffectivePower: number
    sas: BarData[]
    synergy: BarData[]
    antisynergy: BarData[]
    totalCreaturePower: BarData[]
    totalArmor: BarData[]
    aerc: BarData[]
    amberControl: BarData[]
    expectedAmber: BarData[]
    artifactControl: BarData[]
    creatureControl: BarData[]
    efficiency: BarData[]
    disruption: BarData[]
    creatureProtection: BarData[]
    other: BarData[]
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
    efficiencyWinRate?: BarData[]
    disruptionWinRate?: BarData[]
    creatureProtectionWinRate?: BarData[]
    otherWinRate?: BarData[]
    effectivePowerWinRate?: BarData[]

    creatureCountWinRate?: BarData[]
    actionCountWinRate?: BarData[]
    artifactCountWinRate?: BarData[]
    upgradeCountWinRate?: BarData[]

    raresWinRate?: BarData[]
    houseWinRate?: BarData[]

    // Int then Double
    actionCountPercentiles: { [key: number]: number }
    creatureCountPercentiles: { [key: number]: number }
    artifactCountPercentiles: { [key: number]: number }
    upgradeCountPercentiles: { [key: number]: number }

    amberControlPercentiles: { [key: number]: number }
    expectedAmberPercentiles: { [key: number]: number }
    creatureProtectionPercentiles: { [key: number]: number }
    creatureControlPercentiles: { [key: number]: number }
    artifactControlPercentiles: { [key: number]: number }
    effectivePowerPercentiles: { [key: number]: number }
    efficiencyPercentiles: { [key: number]: number }
    disruptionPercentiles: { [key: number]: number }

    aercDatas: AercData[]
}

export interface Wins {
    wins: number
    losses: number
}
