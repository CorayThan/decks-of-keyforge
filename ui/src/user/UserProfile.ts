export interface UserProfile {
    id: string
    username: string
    email?: string
    publicContactInfo?: string
    allowUsersToSeeDeckOwnership: boolean
    country?: string
    preferredCountries?: string[]
}

export interface UserProfileUpdate {
    email?: string
    publicContactInfo?: string
    allowsTrades: boolean
    allowUsersToSeeDeckOwnership: boolean
    currencySymbol: string
    country?: string
    preferredCountries?: string[]
    sellerEmail?: string
    discord?: string
    storeName?: string
    displayCrucibleTrackerWins: boolean
    shippingCost?: string
}
