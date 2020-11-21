import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { log } from "../../config/Utils"
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

    findDeck = (id: string) => {
        axios.get(`${TheoreticalDeckStore.CONTEXT}/${id}`)
            .then((response: AxiosResponse<DeckWithSynergyInfo>) => {
                this.deck = response.data
            })
    }

    findMyTheoreticalDecks = () => {
        this.myTheoryDecks = undefined

        log.info("Find with url: " + `${TheoreticalDeckStore.SECURED_CONTEXT}/mine`)
        axios.get(`${TheoreticalDeckStore.SECURED_CONTEXT}/mine`)
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


}

export const theoreticalDeckStore = new TheoreticalDeckStore()
