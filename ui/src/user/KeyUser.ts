import { UserDeck } from "../userdeck/UserDeck"

export interface KeyUser {
    id: string
    username: string
    email: string
    type: UserType
    publicContactInfo?: string
    decks: UserDeck[]
    country?: string
    lastVersionSeen: string
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
