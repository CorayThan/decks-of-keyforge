import * as React from "react"
import { KCard } from "../cards/KCard"

export interface HasAerc {
    amberControl: number
    expectedAmber: number
    artifactControl: number
    creatureControl: number
    efficiency: number
    effectivePower: number
    amberProtection: number
    disruption: number
    houseCheating: number
    other: number
    aercScore: number

    amberControlMax?: number
    expectedAmberMax?: number
    artifactControlMax?: number
    creatureControlMax?: number
    efficiencyMax?: number
    effectivePowerMax?: number
    amberProtectionMax?: number
    disruptionMax?: number
    houseCheatingMax?: number
    otherMax?: number
    aercScoreMax?: number

    averageAercScore?: number
    
    searchResultCards?: KCard[]
}
