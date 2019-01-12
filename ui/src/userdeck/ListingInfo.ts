import { DeckCondition } from "./UserDeck"

export interface ListingInfo {
    deckId: number
    forSale: boolean
    forTrade: boolean
    condition: DeckCondition
    askingPrice?: number
    listingInfo: string
    externalLink: string
    expireInDays: number
}
