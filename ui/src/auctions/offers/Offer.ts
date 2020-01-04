
export interface OfferDto {
    auctionId: string
    deckId: string
    amount: number
    message: string
    status: OfferStatus

    sentTime: string
    viewedTime?: string
    resolvedTime?: string

    id: string
}

export interface MakeOffer {
    auctionId: string
    amount: number
    message: string
}

export enum OfferStatus {
    SENT = "SENT",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}
