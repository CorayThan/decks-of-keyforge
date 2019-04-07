import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { GlobalStats } from "./GlobalStats"

export class StatsStore {

    static readonly CONTEXT = HttpConfig.API + "/stats"

    @observable
    stats?: GlobalStats

    findGlobalStats = () => {
        axios.get(`${StatsStore.CONTEXT}`)
            .then((response: AxiosResponse) => {
                this.stats = response.data
            })
    }

}

export const statsStore = new StatsStore()
