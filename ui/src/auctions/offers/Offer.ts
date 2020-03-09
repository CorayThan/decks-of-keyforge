import { Deck } from "../../decks/Deck"

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

export interface OffersForDeck {
    deck: Deck
    offers: OfferDto[]
}

export interface MyOffers {
    offersToMe: OffersForDeck[]
    offersIMade: OffersForDeck[]
}

