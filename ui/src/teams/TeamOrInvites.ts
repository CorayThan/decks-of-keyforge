import { UserSearchResult } from "../user/search/UserSearchResult"

export interface TeamOrInvites {
    team?: TeamInfo
    invites: TeamInviteInfo[]
}

export interface TeamInfo {
    members: UserSearchResult[]
    invites: string[]
    leader: string
    name: string
}

export interface TeamInviteInfo {
    teamName: string
    teamId: string
}
