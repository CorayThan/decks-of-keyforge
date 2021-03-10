import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentResults } from "../../generated-src/TournamentResults"
import { messageStore } from "../../ui/MessageStore"

export class TournamentStore {
    static readonly CONTEXT = HttpConfig.API + "/tournaments"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/tournaments/secured"

    @observable
    tournamentInfo?: TournamentInfo

    @observable
    creatingTourney = false

    @observable
    loadingTournament = false

    findTourneyInfo = async (id: number) => {
        this.loadingTournament = true
        const response: AxiosResponse<TournamentInfo> = await axios.get(`${TournamentStore.CONTEXT}/${id}`)
        this.tournamentInfo = response.data
        this.loadingTournament = false
    }

    createTourney = async (id: number, privateTournament: boolean) => {
        this.creatingTourney = true
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/${privateTournament}`)
        this.creatingTourney = false
    }

    pairNextRound = async (id: number) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/pair-next-round`)
        await this.findTourneyInfo(id)
        messageStore.setSuccessMessage("Paired next round!")
    }

    startCurrentRound = async (id: number) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/start-current-round`)
        await this.findTourneyInfo(id)
        messageStore.setSuccessMessage("Paired next round!")
    }

    addParticipant = async (id: number, username: string) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/add-participant/${username}`)
        await this.findTourneyInfo(id)
    }

    dropParticipant = async (id: number, username: string) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/drop-participant/${username}`)
        await this.findTourneyInfo(id)
    }

    reportResults = async (id: number, results: TournamentResults) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/report-results`, results)
        await this.findTourneyInfo(id)
    }

    constructor() {
        makeObservable(this)
    }
}

export const tournamentStore = new TournamentStore()
