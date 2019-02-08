export interface UserProfile {
    id: string
    username: string
    email?: string
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    country?: string
}

export interface UserProfileUpdate {
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    country?: string
}
