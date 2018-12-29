import { KCard } from "../cards/KCard"
import { House } from "../houses/House"
import { UserDeck } from "../userdeck/UserDeck"

export interface Deck {
    id: number
    keyforgeId: string
    name: string
    expansion: number
    powerLevel: number
    chains: number
    wins: number
    losses: number

    expectedAmber: number
    totalPower: number
    totalCreatures: number
    maverickCount: number
    specialsCount: number
    raresCount: number
    uncommonsCount: number

    forSale: boolean
    forTrade: boolean
    wishlistCount: number
    funnyCount: number

    userDecks: UserDeck[]

    cards: KCard[]
    houses: House[]
}

export class DeckUtils {
    static cardsInHouses = (deck: Deck) => {
        const cardsByHouse: Array<{ house: House, cards: KCard[] }> = []
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
