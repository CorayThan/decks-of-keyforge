import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { DeckWithSynergyInfo } from "../../decks/models/DeckSearchResult"
import { DeckBuilderData } from "../DeckBuilderData"

export class TheoreticalDeckStore {
    static readonly CONTEXT = HttpConfig.API + "/theoretical-decks"
    static readonly SECURED_CONTEXT = HttpConfig.API + "/theoretical-decks/secured"

    @observable
    deck?: DeckWithSynergyInfo

    @observable
    myTheoryDecks?: DeckWithSynergyInfo[]

    @observable
    savedDeckId?: string

    @observable
    savingDeck = false

    @observable
    deleting = false

    findDeck = (id: string) => {
        axios.get(`${TheoreticalDeckStore.CONTEXT}/${id}`)
            .then((response: AxiosResponse<DeckWithSynergyInfo>) => {
                this.deck = response.data
            })
    }

    findMyTheoreticalDecks = () => {
        this.myTheoryDecks = undefined

        axios.get(`${TheoreticalDeckStore.SECURED_CONTEXT}/mine`)
            .then((response: AxiosResponse<DeckWithSynergyInfo[]>) => {
                this.myTheoryDecks = response.data
            })
    }

    findMyAllianceDecks = () => {
        this.myTheoryDecks = undefined

        axios.get(`${TheoreticalDeckStore.SECURED_CONTEXT}/alliance/mine`)
            .then((response: AxiosResponse<DeckWithSynergyInfo[]>) => {
                this.myTheoryDecks = response.data
            })
    }

    saveTheoreticalDeck = (deck: DeckBuilderData) => {
        this.savingDeck = true
        axios.post(`${TheoreticalDeckStore.SECURED_CONTEXT}`, deck)
            .then((response: AxiosResponse<string>) => {
                this.savedDeckId = response.data
                this.savingDeck = false
            })
    }

    deleteTheoryDeck = async (id: String) => {
        this.deleting = true
        await axios.post(`${TheoreticalDeckStore.SECURED_CONTEXT}/delete/${id}`)
        this.deleting = false
    }

    constructor() {
        makeObservable(this)
    }
}

export const theoreticalDeckStore = new TheoreticalDeckStore()
