import { DeckCard, KCard } from "../cards/KCard"
import { House } from "../houses/House"
import { DeckSynergyInfo } from "../synergy/DeckSynergyInfo"
import { UserDeck } from "../userdeck/UserDeck"

export interface DeckWithSynergyInfo {
    deck: Deck
    deckSynergyInfo: DeckSynergyInfo
    cardRatingPercentile: number
    synergyPercentile: number
    antisynergyPercentile: number
    sasPercentile: number
}

export interface Deck {

    id: number
    keyforgeId: string
    name: string
    expansion: number
    powerLevel: number
    chains: number
    wins: number
    losses: number

    maverickCount: number
    specialsCount: number
    raresCount: number
    uncommonsCount: number

    rawAmber: number
    totalPower: number
    totalCreatures: number
    totalActions: number
    totalArtifacts: number
    totalUpgrades: number

    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
    sasRating: number
    cardsRating: number
    synergyRating: number
    antisynergyRating: number

    forSale: boolean
    forTrade: boolean
    wishlistCount: number
    funnyCount: number

    userDecks: UserDeck[]

    cards?: DeckCard[]
    searchResultCards?: KCard[]
    houses: House[]
}

export class DeckUtils {
    static cardsInHouses = (deck: Deck) => {
        const cardsByHouse: Array<{ house: House, cards: KCard[] }> = []
        deck.houses
            .forEach((house) => {
                let cards
                if (deck.cards) {
                    cards = deck.cards.map(card => card.card).filter((card) => (card.house === house))
                } else {
                    cards = deck.searchResultCards!.filter(card => card.house === house)
                }
                cardsByHouse.push({house, cards})
            })
        return cardsByHouse
    }
}

export interface DeckPage {
    decks: Deck[]
    page: number
}

export interface DeckCount {
    pages: number
    count: number
}
