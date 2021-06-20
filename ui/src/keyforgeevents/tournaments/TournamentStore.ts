import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { Utils } from "../../config/Utils"
import { KeyForgeEventDto } from "../../generated-src/KeyForgeEventDto"
import { KeyForgeEventFilters } from "../../generated-src/KeyForgeEventFilters"
import { PairingStrategy } from "../../generated-src/PairingStrategy"
import { TournamentInfo } from "../../generated-src/TournamentInfo"
import { TournamentPairingPlayers } from "../../generated-src/TournamentPairingPlayers"
import { TournamentResults } from "../../generated-src/TournamentResults"
import { TournamentSearchResult } from "../../generated-src/TournamentSearchResult"
import { TournamentVisibility } from "../../generated-src/TournamentVisibility"
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

    deleteTournament = async (id: number) => {
        this.savingTournament = true
        await axios.delete(TournamentStore.SECURE_CONTEXT + "/" + id)
        if (this.currentFilters != null) {
            await this.searchTournaments(this.currentFilters)
        }
        this.savingTournament = false
        messageStore.setSuccessMessage("Tournament deleted.")
    }

    pairNextRound = async (id: number, manualPairings?: TournamentPairingPlayers[]) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/pair-next-round`, manualPairings)
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

    verifyParticipant = async (id: number, username: string, verify: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/verify-participant/${username}/${verify}`)
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

    lockRegistration = async (id: number, lock: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/lock-registration/${lock}`)
        await this.findTourneyInfo(id)
    }

    togglePrivate = async (id: number, privateTourney: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/toggle-private/${privateTourney}`)
        await this.findTourneyInfo(id)
    }

    changeVisibility = async (id: number, visibility: TournamentVisibility) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/change-visibility/${visibility}`)
        await this.findTourneyInfo(id)
    }

    lockDeckRegistration = async (id: number, lock: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/lock-deck-registration/${lock}`)
        await this.findTourneyInfo(id)
    }

    organizerAddedDecksOnly = async (id: number, only: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/organizer-added-decks-only/${only}`)
        await this.findTourneyInfo(id)
    }

    allowSelfReporting = async (id: number, allow: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/allow-self-reporting/${allow}`)
        await this.findTourneyInfo(id)
    }

    showDecksToAllPlayers = async (id: number, show: boolean) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/show-decks-to-all-players/${show}`)
        await this.findTourneyInfo(id)
    }

    changePairingStrategy = async (id: number, strategy: PairingStrategy) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/change-pairing-strategy/${strategy}`)
        await this.findTourneyInfo(id)
    }

    extendCurrentRound = async (id: number, minutes: number) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/extend-by-minutes/${minutes}`)
        await this.findTourneyInfo(id)
    }

    changeTournamentParticipant = async (id: number, previousUsername: string, newUsername: string) => {
        await axios.post(`${TournamentStore.SECURE_CONTEXT}/${id}/change-tournament-participant/${previousUsername}/${newUsername}`)
        await this.findTourneyInfo(id)
    }

    constructor() {
        makeObservable(this)
    }
}

export const tournamentStore = new TournamentStore()
