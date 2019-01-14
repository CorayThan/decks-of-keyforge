export interface UserProfile {
    id: string
    username: string
    email?: string
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
}
