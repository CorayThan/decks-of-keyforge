import { AuctionBidDto } from "./AuctionBidDto"

export interface AuctionDto {
    durationDays: number
    endDateTime: string
    bidIncrement: number
    startingBid: number
    buyItNow?: number
    status: AuctionStatus
    bids: AuctionBidDto[]
    highestBid?: number
    currencySymbol: string
    deckId: number
    id: string
}

export enum AuctionStatus {
    ACTIVE = "ACTIVE",
    COMPLETE = "COMPLETE",
    CANCELLED = "CANCELLED"
}
