import { UserDeck } from "../userdecks/UserDeck"

export interface KeyUser {
    id: string
    username: string
    email: string
    type: UserType
    publicContactInfo?: string
    decks: UserDeck[]
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
}

export enum UserType {
    USER,
    ADMIN
}
