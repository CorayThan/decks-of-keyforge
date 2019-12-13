import { DeckLanguage } from "../decks/DeckLanguage"
import { DeckCondition } from "./UserDeck"

export interface ListingInfo {
    deckId: number
    forSaleInCountry: string,
    language: DeckLanguage
    condition: DeckCondition
    askingPrice?: number
    listingInfo: string
    externalLink: string
    expireInDays: number
    bidIncrement?: number
    startingBid?: number
    buyItNow?: number
    endTime?: string
}

export interface UpdatePrice {
    deckId: number
    askingPrice?: number
}
