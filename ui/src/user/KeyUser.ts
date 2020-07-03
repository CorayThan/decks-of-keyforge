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
    autoRenewListings: boolean
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
    acceptsTrades: boolean
    country?: string
    lastVersionSeen: string
}

export enum UserType {
    USER = "USER",
    ADMIN = "ADMIN",
    CONTENT_CREATOR = "CONTENT_CREATOR",
}

export interface KeyUserDto {
    id: string
    username: string
    email: string
    emailVerified: boolean
    sellerEmailVerified: boolean
    type: UserType
    publicContactInfo?: string
    allowsTrades: boolean
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
    shippingCost?: string
    teamName?: string
    autoRenewListings: boolean
}
