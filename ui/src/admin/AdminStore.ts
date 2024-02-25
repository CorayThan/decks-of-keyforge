import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { cardStore, CardStore } from "../cards/CardStore"
import { StatsStore } from "../stats/StatsStore"
import { messageStore } from "../ui/MessageStore"
import { HttpConfig } from "../config/HttpConfig"

export class AdminStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/deck-sas-updates/secured"

    @observable
    reloadingCards = false

    @observable
    publishingSas = false

    @observable
    startingStats = false

    @observable
    info = ""

    reloadCards = async () => {
        this.reloadingCards = true
        await axios.get(`${CardStore.CONTEXT}/reload`)
        await cardStore.loadAllCards()
        this.reloadingCards = false
    }

    publishNewSas = async () => {
        this.publishingSas = true
        const response: AxiosResponse<number> = await axios.post(`${AdminStore.SECURE_CONTEXT}/publish`)
        messageStore.setSuccessMessage(`Publishing SAS version ${response.data}`)
        this.publishingSas = false
    }

    startNewStats = async () => {
        this.startingStats = true
        const statsResponse: AxiosResponse<string> = await axios.post(`${StatsStore.CONTEXT}/start-new`)
        messageStore.setSuccessMessage(statsResponse.data)
        this.startingStats = false
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
