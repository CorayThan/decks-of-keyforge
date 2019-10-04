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
    searchResultCards?: KCard[]
}
