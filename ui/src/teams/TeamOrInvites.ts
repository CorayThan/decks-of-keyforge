
export interface TeamOrInvites {
    team?: TeamInfo
    invites: TeamInviteInfo[]
}

export interface TeamInfo {
    members: string[]
    invites: string[]
    leader: string
    name: string
}

export interface TeamInviteInfo {
    teamName: string
    teamId: string
}
