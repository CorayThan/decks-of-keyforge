import { AuctionBidDto } from "./AuctionBidDto"

export interface AuctionDto {
    durationDays: number
    endDateTime: string
    bidIncrement?: number
    startingBid?: number
    buyItNow?: number
    status: AuctionStatus
    bids: AuctionBidDto[]
    highestBid?: number
    currencySymbol: string
    deckId: number
    id: string
}

export enum AuctionStatus {
    BUY_IT_NOW_ONLY = "BUY_IT_NOW_ONLY",
    ACTIVE = "ACTIVE",
    COMPLETE = "COMPLETE"
}
