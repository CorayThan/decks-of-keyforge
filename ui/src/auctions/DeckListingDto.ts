import { DeckLanguage } from "../decks/DeckLanguage"
import { DeckCondition } from "../userdeck/UserDeck"
import { AuctionBidDto } from "./AuctionBidDto"

export interface DeckListingDto {
    expiresAtLocalDate: string
    dateListedLocalDate: string
    durationDays: number
    endDateTime: string
    bidIncrement?: number
    startingBid?: number
    buyItNow?: number
    status: DeckListingStatus
    bids: AuctionBidDto[]
    highestBid?: number
    highestOffer?: number
    currencySymbol: string
    language: DeckLanguage
    condition: DeckCondition
    listingInfo?: string
    externalLink?: string
    deckId: number
    forTrade: boolean
    id: string
}

export interface UserDeckListingInfo {
    status: DeckListingStatus
    forTrade: boolean
    bidsExist: boolean
    deckId: number
    id: string
}

export enum DeckListingStatus {
    BUY_IT_NOW_ONLY = "BUY_IT_NOW_ONLY",
    ACTIVE = "ACTIVE",
    COMPLETE = "COMPLETE"
}
