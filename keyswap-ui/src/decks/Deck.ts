import { KCard } from "../cards/KCard"
import { House } from "../houses/House"

export interface Deck {
    id: string
    name: string
    expansion: number
    powerLevel: number
    chains: number
    wins: number
    losses: number
    cards: KCard[]
    houses: House[]
}

export class DeckUtils {
    static cardsInHouses = (deck: Deck) => {
        const cardsByHouse: { house: House, cards: KCard[] }[] = []
        deck.houses.forEach((house) => {
            cardsByHouse.push({house, cards: deck.cards.filter((card) => (card.house === house))})
        })
        return cardsByHouse
    }
}

export interface DeckPage {
    decks: Deck[]
    page: number
    pages: number
}
