import { DeckLanguage } from "../decks/DeckLanguage"
import { DeckCondition } from "../userdeck/UserDeck"
import { AuctionBidDto } from "./AuctionBidDto"

export interface AuctionDto {
    expiresAtLocalDate: string
    dateListedLocalDate: string
    durationDays: number
    endDateTime: string
    bidIncrement?: number
    startingBid?: number
    buyItNow?: number
    status: AuctionStatus
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

export enum AuctionStatus {
    BUY_IT_NOW_ONLY = "BUY_IT_NOW_ONLY",
    ACTIVE = "ACTIVE",
    COMPLETE = "COMPLETE"
}
