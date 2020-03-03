import { DeckListingStatus } from "../../auctions/DeckListingDto"
import { DeckCondition } from "../../userdeck/UserDeck"
import { DeckLanguage } from "../DeckLanguage"

export interface DeckSaleInfo {
    forTrade: boolean
    forAuction: boolean
    acceptingOffers: boolean

    forSaleInCountry?: string
    currencySymbol: string
    language?: DeckLanguage

    highestBid?: number
    highestOffer?: number
    buyItNow?: number
    startingBid?: number
    auctionEndDateTime?: string
    auctionId?: string
    nextBid?: number
    youAreHighestBidder?: boolean
    yourMaxBid?: number
    bidIncrement?: number
    auctionStatus?: DeckListingStatus
    boughtBy?: string
    boughtWithBuyItNow?: boolean
    boughtNowOn?: string
    shippingCost?: string

    listingInfo?: string
    externalLink?: string
    condition: DeckCondition
    dateListed: string
    expiresAt?: string

    username: string
    publicContactInfo?: string
    discord?: string
}
