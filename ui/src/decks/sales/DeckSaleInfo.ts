import { userStore } from "../../user/UserStore"
import { DeckCondition, UserDeckDto } from "../../userdeck/UserDeck"
import { DeckLanguage } from "../DeckLanguage"

export interface DeckSaleInfo {
    forSale: boolean
    forTrade: boolean
    auction: boolean

    forSaleInCountry?: string
    currencySymbol?: string
    language?: DeckLanguage

    askingPrice?: number

    highestBid?: number
    buyItNow?: number
    startingBid?: number
    auctionEndDateTime?: string
    auctionId?: string
    nextBid?: number
    youAreHighestBidder?: boolean
    yourMaxBid?: number

    listingInfo?: string
    externalLink?: string
    condition: DeckCondition
    dateListed: string
    expiresAt?: string

    username: string
    publicContactInfo?: string
    discord?: string
}

export const deckSaleInfoFromUserDeckDto = (userDeck: UserDeckDto): DeckSaleInfo | undefined => {

    const {
        forSale, forTrade, forAuction, askingPrice, listingInfo, externalLink, condition, dateListedLocalDate, expiresAtLocalDate, currencySymbol,
        language, auction
    } = userDeck

    const user = userStore.user

    if ((!userDeck.forSale && !userDeck.forTrade) || user == null) {
        return undefined
    }
    return {
        forSale,
        forTrade,
        auction: forAuction,

        forSaleInCountry: user.country,
        currencySymbol,
        language,

        askingPrice,

        highestBid: auction ? auction.highestBid : undefined,
        buyItNow: auction ? auction.buyItNow : undefined,

        listingInfo,
        externalLink,

        dateListed: dateListedLocalDate!,
        expiresAt: expiresAtLocalDate,

        condition: condition == null ? DeckCondition.NEW_IN_PLASTIC : condition,
        username: user.username,
        publicContactInfo: user.publicContactInfo,
        discord: user.discord
    }
}
