import { PatreonRewardsTier } from "../generated-src/PatreonRewardsTier"
import { UserType } from "../generated-src/UserType"
import { UserDeck } from "../userdeck/UserDeck"

export interface KeyUser {
    id: string
    username: string
    email: string
    emailVerified: boolean
    type: UserType
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    preferredCountries?: string[]
    decks: UserDeck[]
    currencySymbol: string
    country?: string
    lastVersionSeen: string
    patreonId?: string
    patreonTier?: PatreonRewardsTier
    autoRenewListings: boolean
}

