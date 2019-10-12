import { BackendExpansion } from "../expansions/Expansions"
import { SynTraitValue } from "../synergy/SynTraitValue"

export interface ExtraCardInfo {
    cardNumbers: CardIdentifier[]
    rating: number
    expectedAmber: number
    expectedAmberMax?: number
    amberControl: number
    amberControlMax?: number
    creatureControl: number
    creatureControlMax?: number
    artifactControl: number
    artifactControlMax?: number
    efficiency: number
    efficiencyMax?: number
    effectivePower: number
    effectivePowerMax?: number
    disruption: number
    disruptionMax?: number
    amberProtection: number
    amberProtectionMax?: number
    houseCheating: number
    houseCheatingMax?: number
    other: number
    otherMax?: number

    traits: SynTraitValue[]
    synergies: SynTraitValue[]

    version: number
    active: boolean

    id: number
}

export interface CardIdentifier {
    expansion: BackendExpansion
    cardNumber: string
}