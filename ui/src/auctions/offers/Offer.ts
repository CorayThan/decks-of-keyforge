
export interface OfferDto {
    deckListingId: string
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
    deckListingId: string
    amount: number
    message: string
    expireInDays: number
}

export enum OfferStatus {
    SENT = "SENT",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}
