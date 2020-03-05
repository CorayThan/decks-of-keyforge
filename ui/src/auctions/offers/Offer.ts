
export interface OfferDto {
    deckListingId: string
    deckId: string
    amount: number
    message: string
    status: OfferStatus

    sentTime: string
    expiresOn: string
    viewedTime?: string
    resolvedTime?: string

    country: string

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
