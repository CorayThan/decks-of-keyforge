import { ForSaleQueryEntity } from "../decks/salenotifications/ForSaleQuery"
import { UserDeck } from "../userdeck/UserDeck"

export interface KeyUser {
    id: string
    username: string
    email: string
    type: UserType
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    preferredCountries?: string[]
    decks: UserDeck[]
    country?: string
    lastVersionSeen: string
    forSaleQueries: ForSaleQueryEntity[]
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
    type: UserType
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    country?: string
    preferredCountries?: string[]
    forSaleQueries?: ForSaleQueryEntity[]
    lastVersionSeen: string
}
