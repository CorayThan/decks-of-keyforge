import { HasAerc } from "../aerc/HasAerc"

export interface DeckSynergyInfo {
    synergyCombos: SynergyCombo[]
    synergyRating: number
    antisynergyRating: number
}

export interface SynergyCombo extends HasAerc {
    cardName: string
    synergies: string[]
    antisynergies: string[]
    synergy: number
    antisynergy: number
    netSynergy: number
    cardRating: number

    copies: number
}
