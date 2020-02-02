import { UserSearchResult } from "./UserSearchResult"

export interface UserSearchResults {
    updatedMinutesAgo: number
    users: UserSearchResult[]
}
