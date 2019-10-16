import { SynergyTrait } from "../extracardinfo/SynergyTrait"
import { House } from "../houses/House"
import { SynTraitType } from "./SynTraitType"

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
    synergy: number
    antisynergy: number
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
    trait: SynergyTrait
    percentSynergized: number
    traitCards: string[]
    rating: number
    type: SynTraitType
}
