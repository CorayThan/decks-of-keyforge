import { ForSaleQueryEntity } from "../decks/salenotifications/ForSaleQuery"
import { PatreonRewardsTier } from "../thirdpartysites/patreon/PatreonRewardsTier"
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
    forSaleQueries: ForSaleQueryEntity[]
    patreonId?: string
    patreonTier?: PatreonRewardsTier
}

export interface UserLogin {
    email: string
    password: string
}

export interface UserRegistration {
    username: string
    email: string
    password: string
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    country?: string
    lastVersionSeen: string
}

export enum UserType {
    USER,
    ADMIN
}

export interface KeyUserDto {
    id: string
    username: string
    email: string
    emailVerified: boolean
    type: UserType
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    currencySymbol: string
    country?: string
    preferredCountries?: string[]
    lastVersionSeen: string
    patreonId?: string
    patreonTier?: PatreonRewardsTier
    sellerEmail?: string
    discord?: string
    storeName?: string
    auctionCount: number
}
