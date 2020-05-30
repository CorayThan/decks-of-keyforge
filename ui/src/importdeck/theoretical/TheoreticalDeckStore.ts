import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { DeckWithSynergyInfo } from "../../decks/models/DeckSearchResult"
import { SaveUnregisteredDeck } from "../SaveUnregisteredDeck"

export class TheoreticalDeckStore {

    static readonly CONTEXT = HttpConfig.API + "/theoretical-decks"

    @observable
    deck?: DeckWithSynergyInfo

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

    saveTheoreticalDeck = (deck: SaveUnregisteredDeck) => {
        this.savingDeck = true
        axios.post(`${TheoreticalDeckStore.CONTEXT}`, deck)
            .then((response: AxiosResponse<string>) => {
                this.savedDeckId = response.data
                this.savingDeck = false
            })
    }


}

export const theoreticalDeckStore = new TheoreticalDeckStore()
