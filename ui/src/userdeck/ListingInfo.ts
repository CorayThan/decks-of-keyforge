import { DeckLanguage } from "../decks/DeckLanguage"
import { DeckCondition } from "./UserDeck"

export interface ListingInfo {
    deckId: number
    forSaleInCountry: string,
    language: DeckLanguage
    condition: DeckCondition
    listingInfo: string
    externalLink: string
    bidIncrement?: number
    startingBid?: number
    buyItNow?: number
    expireInDays: number
    endTime?: string
    editAuctionId?: string
}

export interface UpdatePrice {
    auctionId: string
    askingPrice?: number
}
