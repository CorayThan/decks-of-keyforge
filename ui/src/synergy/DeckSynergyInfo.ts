import { House } from "../houses/House"
import { SynTraitValue } from "./SynTraitValue"

export interface DeckSynergyInfo {
    rawAerc: number
    sasRating: number
    synergyRating: number
    antisynergyRating: number
    synergyCombos: SynergyCombo[]

    expectedAmber: number,
    amberControl: number,
    creatureControl: number,
    artifactControl: number,
    efficiency: number,
    effectivePower: number,
    amberProtection: number,
    disruption: number,
    houseCheating: number,
    other: number,
}

export interface SynergyCombo {
    house: House
    cardName: string
    synergies: SynergyMatch[]
    netSynergy: number
    aercScore: number

    expectedAmber: number,
    amberControl: number,
    creatureControl: number,
    artifactControl: number,
    efficiency: number,
    effectivePower: number,
    amberProtection: number,
    disruption: number,
    houseCheating: number,
    other: number,

    copies: number
}

export interface SynergyMatch {
    trait: SynTraitValue
    percentSynergized: number
    traitCards: string[]
}
