import { UserStore } from "../../user/UserStore"
import { DeckCondition, UserDeck } from "../../userdeck/UserDeck"

export interface DeckSaleInfo {
    forSale: boolean
    forTrade: boolean
    forSaleInCountry?: string

    askingPrice?: number

    listingInfo?: string
    externalLink?: string
    condition: DeckCondition
    dateListed: string
    expiresAt?: string

    username: string
    publicContactInfo?: string
}

export const deckSaleInfoFromUserDeck = (userDeck: UserDeck): DeckSaleInfo | undefined => {

    const {forSale, forTrade, askingPrice, listingInfo, externalLink, condition, dateListedLocalDate, expiresAtLocalDate} = userDeck

    const user = UserStore.instance.user

    if ((!userDeck.forSale && !userDeck.forTrade) || user == null) {
        return undefined
    }
    return {
        forSale,
        forTrade,
        forSaleInCountry: user.country,

        askingPrice,

        listingInfo,
        externalLink,

        dateListed: dateListedLocalDate!,
        expiresAt: expiresAtLocalDate,

        condition: condition == null ? DeckCondition.NEW_IN_PLASTIC : condition,
        username: user.username,
        publicContactInfo: user.publicContactInfo
    }
}
