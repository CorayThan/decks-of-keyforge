export interface DeckSynergyInfo {
    synergyCombos: SynergyCombo[]
    synergyRating: number
    antisynergyRating: number
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
