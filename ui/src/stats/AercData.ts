import { BackendExpansion } from "../expansions/Expansions"
import { House } from "../houses/House"

export interface AercData {
    count: number
    
    expansion: BackendExpansion
    house?: House

    amberControl: number
    expectedAmber: number
    artifactControl: number
    creatureControl: number
    effectivePower: number
    efficiency: number
    disruption: number
    creatureProtection: number
    other: number
}
