import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { GlobalStats } from "./GlobalStats"

export class StatsStore {

    static readonly CONTEXT = HttpConfig.API + "/stats"
    private static innerInstance: StatsStore

    @observable
    stats?: GlobalStats

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    findGlobalStats = () => {
        axios.get(`${StatsStore.CONTEXT}`)
            .then((response: AxiosResponse) => {
                this.stats = response.data
            })
    }

}