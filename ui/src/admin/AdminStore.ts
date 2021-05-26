import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { cardStore, CardStore } from "../cards/CardStore"
import { StatsStore } from "../stats/StatsStore"
import { messageStore } from "../ui/MessageStore"

export class AdminStore {

    @observable
    reloadingCards = false


    @observable
    info = ""

    reloadCards = async () => {
        this.reloadingCards = true
        await axios.get(`${CardStore.CONTEXT}/reload`)
        await cardStore.loadAllCards()
        this.reloadingCards = false
    }

    startNewStats = async () => {
        const statsResponse: AxiosResponse<string> = await axios.post(`${StatsStore.CONTEXT}/start-new`)
        messageStore.setSuccessMessage(statsResponse.data)
    }

    findStatsInfo = async () => {
        const statsResponse: AxiosResponse<string> = await axios.get(`${StatsStore.CONTEXT}/info`)
        this.info = statsResponse.data
    }

    constructor() {
        makeObservable(this)
    }

}

export const adminStore = new AdminStore()
