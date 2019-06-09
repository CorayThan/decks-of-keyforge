import { AuctionListingInfo } from "../auctions/AuctionListingInfo"
import { DeckLanguage } from "../decks/DeckLanguage"
import { DeckCondition } from "./UserDeck"

export interface ListingInfo {
    deckId: number
    forSale: boolean
    forTrade: boolean
    forSaleInCountry: string,
    language: DeckLanguage
    condition: DeckCondition
    askingPrice?: number
    listingInfo: string
    externalLink: string
    expireInDays: number
    auctionListingInfo?: AuctionListingInfo
}

export interface UpdatePrice {
    deckId: number
    askingPrice?: number
}
