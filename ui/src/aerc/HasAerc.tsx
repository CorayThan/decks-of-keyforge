import * as React from "react"
import { KCard } from "../cards/KCard"

export interface HasAerc {
    amberControl: number
    expectedAmber: number
    artifactControl: number
    creatureControl: number
    aercScore: number
    efficiency: number
    effectivePower: number
    stealPrevention: number
    disruption: number
    houseCheating: number
    other: number
    searchResultCards?: KCard[]
}
