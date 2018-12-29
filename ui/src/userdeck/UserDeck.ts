import { Deck } from "../decks/Deck"
import { KeyUser } from "../user/KeyUser"

export interface UserDeck {
    id: string
    user: KeyUser
    deck: Deck
    wishlist: boolean
    funny: boolean
    owned: boolean

    forSale: boolean
    forTrade: boolean

    askingPrice?: number

    listingInfo?: string
    condition?: DeckCondition
    redeemed: boolean
    dateListed: string
    dateRefreshed: string
}

export enum DeckCondition {
    NEW_IN_PLASTIC = "NEW_IN_PLASTIC",
    NEAR_MINT = "NEAR_MINT",
    PLAYED = "PLAYED",
    HEAVILY_PLAYED = "HEAVILY_PLAYED",
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
