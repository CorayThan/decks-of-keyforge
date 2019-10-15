import { HasAerc } from "../aerc/HasAerc"
import { SynergyTrait } from "../extracardinfo/SynergyTrait"
import { House } from "../houses/House"

export interface DeckSynergyInfo {
    synergyCombos: SynergyCombo[]
    synergyRating: number
    antisynergyRating: number
}

export interface SynergyCombo extends HasAerc {
    house: House
    cardName: string
    synergies: SynergyMatch[]
    synergy: number
    antisynergy: number
    netSynergy: number
    cardRating: number

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
}
