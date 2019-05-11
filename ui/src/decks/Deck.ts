import { KCard } from "../cards/KCard"
import { House } from "../houses/House"
import { DeckSynergyInfo } from "../synergy/DeckSynergyInfo"
import { UserDeck } from "../userdeck/UserDeck"
import { DeckSaleInfo } from "./sales/DeckSaleInfo"

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

    registered: boolean

    maverickCount: number
    specialsCount: number
    raresCount: number
    uncommonsCount: number

    rawAmber: number
    totalPower: number
    creatureCount: number
    actionCount: number
    artifactCount: number
    upgradeCount: number

    cardDrawCount: number
    cardArchiveCount: number
    keyCheatCount: number
    totalArmor: number

    expectedAmber: number
    amberControl: number
    creatureControl: number
    artifactControl: number
    deckManipulation: number
    effectivePower: number
    aercScore: number
    sasRating: number
    cardsRating: number
    synergyRating: number
    antisynergyRating: number

    forSale: boolean
    forTrade: boolean
    forAuction: boolean
    wishlistCount: number
    funnyCount: number

    userDecks: UserDeck[]

    searchResultCards?: KCard[]
    houses: House[]

    deckSaleInfo?: DeckSaleInfo[]
}

export class DeckUtils {
    static cardsInHouses = (deck: Deck) => {
        const cardsByHouse: Array<{ house: House, cards: KCard[] }> = []
        deck.houses
            .forEach((house) => {
                const cards = deck.searchResultCards!.filter(card => card.house === house)
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
