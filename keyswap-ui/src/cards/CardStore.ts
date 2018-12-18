import axios, { AxiosResponse } from "axios"
import { IObservableArray, observable } from "mobx"
import { API } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { Card } from "./Card"
import { CardFilters } from "./CardFilters"

export class CardStore {

    static readonly CONTEXT = API + "/cards"
    private static innerInstance: CardStore

    cards: IObservableArray<Card> = observable([])

    @observable
    searchingForCards = false

    // @observable
    // firstCardName = ""

    private constructor() {
    }
    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    reset = () => {
        this.cards.clear()
    }

    searchCards = (filters: CardFilters) => {
        this.searchingForCards = true
        axios.post(`${CardStore.CONTEXT}/filter`, filters)
            .then((response: AxiosResponse) => {
                this.searchingForCards = false
                log.debug(`With filters: ${prettyJson(filters)} Got the filtered cards. cards: ${prettyJson(response.data)}`)
                this.cards.replace(response.data)
                // this.firstCardName = response.data[0].cardTitle
            })
    }
}