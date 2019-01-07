import { Deck } from "../decks/Deck"
import { House } from "../houses/House"
import { SynTraitValue } from "../synergy/SynTraitValue"
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

    extraCardInfo: ExtraCardInfo
}

export interface DeckCard {
    deck: Deck
    card: KCard
    cardName: string
    quantityInDeck: number
    id: string
}

export interface ExtraCardInfo {
    cardNumber: number
    rating: number
    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number

    traits: string[]
    synergies: SynTraitValue[]
}
