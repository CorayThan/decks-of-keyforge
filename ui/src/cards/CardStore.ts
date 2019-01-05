import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { CardFilters } from "./CardFilters"
import { KCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards"
    private static innerInstance: CardStore

    @observable
    cards?: KCard[]

    @observable
    searchingForCards = false

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
                log.debug(`With filters: ${prettyJson(filters)} Got the filtered cards. cards: ${prettyJson(response.data)}`)
                this.cards = response.data
                this.searchingForCards = false
            })
    }
}
