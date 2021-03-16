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

    @observable
    reportingResults = false

    @observable
    addingDeck = false

    @observable
    endingTournament = false

    findTourneyInfo = async (id: number) => {
        this.loadingTournament = true
        const response: AxiosResponse<TournamentInfo> = await axios.get(`${TournamentStore.CONTEXT}/${id}`)
        this.tournamentInfo = response.data
        this.loadingTournament = false
    }

    createTourney = async (id: number, privateTournament: boolean) => {
        this.creatingTourney = true
        const response: AxiosResponse<number> = await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/${privateTournament}`)
        this.creatingTourney = false
        return response.data
    }

    pairNextRound = async (id: number) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/pair-next-round`)
        await this.findTourneyInfo(id)
        messageStore.setSuccessMessage("Paired round!")
    }

    startCurrentRound = async (id: number) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/start-current-round`)
        await this.findTourneyInfo(id)
        messageStore.setSuccessMessage("Started round!")
    }

    endTournament = async (id: number, end: boolean) => {
        this.endingTournament = true
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/end-tournament/${end}`)
        await this.findTourneyInfo(id)
        this.endingTournament = false
    }

    addDeck = async (id: number, deckId: string, username: string) => {
        this.addingDeck = true
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/add-deck/${deckId}/${username}`)
        await this.findTourneyInfo(id)
        this.addingDeck = false
    }

    addParticipant = async (id: number, username: string) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/add-participant/${username}`)
        await this.findTourneyInfo(id)
    }

    dropParticipant = async (id: number, username: string, drop: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/drop-participant/${username}/${drop}`)
        await this.findTourneyInfo(id)
    }

    reportResults = async (id: number, results: TournamentResults) => {
        this.reportingResults = true
        try {
            await axios.post(`${TournamentStore.SECURE_CONTEXT}/report-results`, results)
            await this.findTourneyInfo(id)
        } catch (e) {
            // do not much
        }

        this.reportingResults = false
    }

    constructor() {
        makeObservable(this)
    }
}

export const tournamentStore = new TournamentStore()
