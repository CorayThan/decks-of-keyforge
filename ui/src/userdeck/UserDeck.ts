import { DeckSearchResult } from "../decks/models/DeckSearchResult"
import { DeckCondition } from "../generated-src/DeckCondition"
import { DeckLanguage } from "../generated-src/DeckLanguage"
import { KeyUser } from "../user/KeyUser"

export interface UserDeck {
    id: string
    user: KeyUser
    deck: DeckSearchResult
    wishlist: boolean
    funny: boolean
    ownedBy: string

    forSale: boolean
    forTrade: boolean

    forSaleInCountry?: string,
    language?: DeckLanguage,
    currencySymbol: string,

    askingPrice?: number

    listingInfo?: string
    condition?: DeckCondition
    redeemed: boolean
    externalLink?: string
    dateListed?: string
    expiresAt?: string

    notes?: string

    dateListedLocalDate?: string
    expiresAtLocalDate?: string
}

export const deckConditionReadableValue = (condition: DeckCondition) => {
    if (condition === DeckCondition.NEW_IN_PLASTIC) {
        return "New in Plastic"
    } else if (condition === DeckCondition.NEAR_MINT) {
        return "Near Mint"
    } else if (condition === DeckCondition.PLAYED) {
        return "Played"
    } else if (condition === DeckCondition.HEAVILY_PLAYED) {
        return "Heavily Played"
    } else {
        throw new Error(`Unexpected deck condition: ${condition}`)
    }
}

export interface UserDeckDto {
    id: string
    wishlist: boolean
    funny: boolean
    ownedBy: string

    // On DTO version only
    deckId: number
    notes?: string
}
