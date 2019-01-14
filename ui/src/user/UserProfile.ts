export interface UserProfile {
    id: string
    username: string
    email?: string
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
}

export interface UserProfileUpdate {
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
}
