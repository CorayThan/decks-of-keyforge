export interface DeckSynergyInfo {
    synergyRating: number
    antisynergyRating: number
    synergyCombos: SynergyCombo[]
}

export interface SynergyCombo {
    cardName: string
    synergies: string[]
    antisynergies: string[]
    synergy: number
    antisynergy: number
    netSynergy: number
    cardRating: number
    copies: number
}
