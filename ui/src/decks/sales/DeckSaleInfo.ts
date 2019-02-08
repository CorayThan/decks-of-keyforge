import { DeckCondition } from "../../userdeck/UserDeck"

export interface DeckSaleInfo {
    forSale: boolean
    forTrade: boolean
    forSaleInCountry?: string

    askingPrice?: number

    listingInfo?: string
    externalLink?: string
    condition: DeckCondition
    redeemed: boolean
    dateListed: string
    dateExpires: string

    username: string
    publicContactInfo?: string
}
