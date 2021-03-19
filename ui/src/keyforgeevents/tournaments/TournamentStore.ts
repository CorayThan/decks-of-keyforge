import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { Utils } from "../../config/Utils"
import { KeyForgeEventDto } from "../../generated-src/KeyForgeEventDto"
import { KeyForgeEventFilters } from "../../generated-src/KeyForgeEventFilters"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentResults } from "../../generated-src/TournamentResults"
import { TournamentSearchResult } from "../../generated-src/TournamentSearchResult"
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

    currentFilters?: KeyForgeEventFilters

    @observable
    searching = false

    @observable
    foundTournaments: TournamentSearchResult[] = []

    @observable
    savingTournament = false

    searchTournaments = async (filters: KeyForgeEventFilters) => {
        this.searching = true
        const filtersCopied = Utils.jsonCopy(filters)
        filtersCopied.withTournaments = true
        this.currentFilters = filtersCopied
        const response: AxiosResponse<TournamentSearchResult[]> = await axios.post(TournamentStore.CONTEXT + "/search", filters)
        this.foundTournaments = response.data
        this.searching = false
    }

    findTourneyInfo = async (id: number) => {
        this.loadingTournament = true
        const response: AxiosResponse<TournamentInfo> = await axios.get(`${TournamentStore.CONTEXT}/${id}`)
        this.tournamentInfo = response.data
        this.loadingTournament = false
    }

    addTourneyToEvent = async (id: number, privateTournament: boolean) => {
        this.creatingTourney = true
        const response: AxiosResponse<number> = await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/${privateTournament}`)
        this.creatingTourney = false
        return response.data
    }

    createTournament = async (event: KeyForgeEventDto) => {
        this.savingTournament = true
        await axios.post(TournamentStore.SECURE_CONTEXT, event)
        if (this.currentFilters != null) {
            await this.searchTournaments(this.currentFilters)
        }
        this.savingTournament = false
        messageStore.setSuccessMessage("Created your new tournament!")
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

    removeDeck = async (id: number, tournamentDeckId: number) => {
        this.addingDeck = true
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/remove-deck/${tournamentDeckId}`)
        await this.findTourneyInfo(id)
        this.addingDeck = false
    }

    addTO = async (id: number, username: string) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/add-to/${username}`)
        await this.findTourneyInfo(id)
    }

    removeTo = async (id: number, username: string) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/remove-to/${username}`)
        await this.findTourneyInfo(id)
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
