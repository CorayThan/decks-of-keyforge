import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { CardFilters } from "./CardFilters"
import { KCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards"
    private static innerInstance: CardStore

    @observable
    cards?: KCard[]

    @observable
    searchingForCards = false

    @observable
    allCards: KCard[] = []

    @observable
    cardNames: Array<{label: string, value: string}> = []

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    reset = () => {
        if (this.cards) {
            this.cards = undefined
        }
    }

    searchCards = (filters: CardFilters) => {
        this.searchingForCards = true
        axios.post(`${CardStore.CONTEXT}/filter`, filters)
            .then((response: AxiosResponse) => {
                // log.debug(`With filters: ${prettyJson(filters)} Got the filtered cards. cards: ${prettyJson(response.data)}`)
                this.cards = response.data
                this.searchingForCards = false
            })
    }

    loadAllCards = () => {
        axios.get(`${CardStore.CONTEXT}`)
            .then((response: AxiosResponse) => {
                this.allCards = response.data
                this.cardNames = this.allCards!.map(card => ({label: card.cardTitle, value: card.cardTitle}))
                // sortBy(this.cardSuggestions, suggestion => suggestion.value.cardNumber)
            })
    }
}
