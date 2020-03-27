export interface OfferDto {
    deckListingId: string
    deckId: string
    amount: number
    message: string
    status: OfferStatus
    senderArchived: boolean
    recipientArchived: boolean
    expired: boolean


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
    CANCELED = "CANCELED",
    EXPIRED = "EXPIRED"
}

export interface OffersForDeck {
    deck: OfferDeckData
    offers: OfferDto[]
}

interface OfferDeckData {
    id: string
    name: string
    currency: string
    sas: number
}

export interface MyOffers {
    offersToMe: OffersForDeck[]
    offersIMade: OffersForDeck[]
}


