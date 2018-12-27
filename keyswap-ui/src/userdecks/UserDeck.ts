import { Deck } from "../decks/Deck"
import { KeyUser } from "../user/KeyUser"

export interface UserDeck {
    id: string
    user: KeyUser
    deck: Deck
    favorite: boolean
    funny: boolean
    owned: boolean

    forSale: boolean
    forTrade: boolean

    askingPrice?: string
    tradeRequests?: string

    listingInfo?: string
    condition?: DeckCondition
    redeemed: boolean
    dateListed: string
    dateRefreshed: string
}

export enum DeckCondition {
    NEW_IN_PLASTIC,
    NEAR_MINT,
    PLAYED
}
