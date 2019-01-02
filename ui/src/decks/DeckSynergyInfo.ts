export interface DeckSynergyInfo {
    synergyRating: number
    antisynergyRating: number
    synergyCombos: SynergyCombo[]
}

export interface SynergyCombo {
    cardName: string
    synergies: string[]
    antisynergies: string[]
    netSynergy: number
    copies: number
}
