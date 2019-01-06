import { DeckCondition } from "../../userdeck/UserDeck"

export interface DeckSaleInfo {
    forSale: boolean
    forTrade: boolean

    askingPrice?: number

    listingInfo?: string
    externalLink?: string
    condition: DeckCondition
    redeemed: boolean
    dateListed: string

    username: string
    publicContactInfo?: string
}