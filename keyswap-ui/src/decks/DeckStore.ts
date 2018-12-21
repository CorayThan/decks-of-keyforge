import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { API } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { DeckPage } from "./Deck"
import { DeckFilters } from "./DeckFilters"

export class DeckStore {

    static readonly CONTEXT = API + "/decks"
    private static innerInstance: DeckStore

    @observable
    deckPage?: DeckPage

    @observable
    searchingForDecks = false

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    reset = () => {
        this.deckPage = undefined
    }

    searchDecks = (filters: DeckFilters) => {
        this.searchingForDecks = true
        axios.post(`${DeckStore.CONTEXT}/filter`, filters)
            .then((response: AxiosResponse) => {
                log.debug(`With filters: ${prettyJson(filters)} Got the filtered decks. decks: ${prettyJson(response.data)}`)
                this.deckPage = observable(response.data)
                this.searchingForDecks = false
            })
    }
}