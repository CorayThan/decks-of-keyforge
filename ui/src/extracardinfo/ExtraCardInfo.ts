import { BackendExpansion } from "../expansions/Expansions"
import { SynTraitValue } from "../synergy/SynTraitValue"

export interface ExtraCardInfo {
    cardName: string
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
    creatureProtection: number
    creatureProtectionMax?: number
    other: number
    otherMax?: number

    enhancementAmber: number
    enhancementCapture: number
    enhancementDraw: number
    enhancementDamage: number

    /**
     * In Zoned Date Time format
     */
    published: string
    publishedDate: string

    traits: SynTraitValue[]
    synergies: SynTraitValue[]

    version: number
    active: boolean

    id: string
}

export interface CardIdentifier {
    expansion: BackendExpansion
    cardNumber: string
    id: string
}
