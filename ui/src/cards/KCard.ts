import { Deck } from "../decks/Deck"
import { House } from "../houses/House"
import { CardType } from "./CardType"
import { Rarity } from "./rarity/Rarity"

export interface KCard {
    id: string
    cardTitle: string
    house: House
    cardType: CardType
    frontImage: string
    cardText: string
    traits: string[]
    amber: number
    power: number
    armor: number
    rarity: Rarity
    flavorText?: string
    cardNumber: number
    expansion: number
    maverick: boolean
}

export interface DeckCard {
    deck: Deck
    card: KCard
    cardName: string
    quantityInDeck: number
    id: string
}
