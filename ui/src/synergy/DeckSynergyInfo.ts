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

    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
    deckManipulation: number
    effectivePower: number
    
    copies: number
}
