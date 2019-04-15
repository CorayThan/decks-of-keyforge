import { AuctionBidDto } from "./AuctionBidDto"

export interface AuctionDto {
    durationDays: number
    endDateTime: string
    bidIncrement: number
    startingBid: number
    buyItNow?: number
    complete: boolean
    bids: AuctionBidDto[]
    highestBid?: number
    id: string
}
