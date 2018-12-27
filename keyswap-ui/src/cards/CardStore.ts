import axios, { AxiosResponse } from "axios"
import { IObservableArray, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { CardFilters } from "./CardFilters"
import { KCard } from "./KCard"

export class CardStore {

    static readonly CONTEXT = HttpConfig.API + "/cards/public"
    private static innerInstance: CardStore

    cards?: IObservableArray<KCard>

    @observable
    searchingForCards = false

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    reset = () => {
        if (this.cards) {
            this.cards.clear()
        }
    }

    searchCards = (filters: CardFilters) => {
        this.searchingForCards = true
        axios.post(`${CardStore.CONTEXT}/filter`, filters)
            .then((response: AxiosResponse) => {
                log.debug(`With filters: ${prettyJson(filters)} Got the filtered cards. cards: ${prettyJson(response.data)}`)
                if (this.cards) {
                    this.cards.replace(response.data)
                } else {
                    this.cards = observable(response.data)
                }
                this.searchingForCards = false
            })
    }
}