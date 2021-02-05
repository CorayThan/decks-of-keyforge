import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { TeamOrInvites } from "../generated-src/TeamOrInvites"
import { messageStore } from "../ui/MessageStore"

export class TeamStore {
    static readonly SECURE_CONTEXT = HttpConfig.API + "/teams/secured"

    @observable
    teamOrInvites?: TeamOrInvites

    @observable
    loadingTeamPage = false

    formOrUpdate = (teamName: string) => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/${teamName}`)
            .then(() => {
                messageStore.setSuccessMessage("Team created!")
                this.findTeamInfo()
            })
    }

    inviteToTeam = (username: string) => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/invite/${username}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Invited ${username} to team!`)
                } else {
                    messageStore.setWarningMessage(`Couldn't invite ${username}. Is the username correct?`)
                }
                this.findTeamInfo()
            })
    }

    removeFromTeam = (username: string) => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/remove/${username}`)
            .then(() => {
                messageStore.setSuccessMessage(`Removed ${username} from team.`)
                this.findTeamInfo()
            })
    }

    removeInvite = (username: string) => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/remove-invite/${username}`)
            .then(() => {
                messageStore.setSuccessMessage(`Removed ${username}'s invite.`)
                this.findTeamInfo()
            })
    }

    disbandTeam = () => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/disband`)
            .then(() => {
                messageStore.setSuccessMessage(`Farewell fair team, you shall be missed.`)
                this.findTeamInfo()
            })
    }

    joinTeam = (teamId: string, teamname: string) => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/join/${teamId}`)
            .then(() => {
                messageStore.setSuccessMessage(`Welcome to ${teamname}!`)
                this.findTeamInfo()
            })
    }

    leaveTeam = () => {
        axios.post(`${TeamStore.SECURE_CONTEXT}/leave`)
            .then(() => {
                this.findTeamInfo()
            })
    }

    findTeamInfo = () => {
        this.loadingTeamPage = true
        axios.get(`${TeamStore.SECURE_CONTEXT}`)
            .then((response: AxiosResponse<TeamOrInvites>) => {
                this.teamOrInvites = response.data
                this.loadingTeamPage = false
            })
    }

    constructor() {
        makeObservable(this)
    }
}

export const teamStore = new TeamStore()
