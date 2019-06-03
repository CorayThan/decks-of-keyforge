import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { Expansion } from "../expansions/Expansions"
import { GlobalStats, GlobalStatsWithExpansion } from "./GlobalStats"

export class StatsStore {

    static readonly CONTEXT = HttpConfig.API + "/stats"

    @observable
    stats?: GlobalStats

    @observable
    currentStatsExpansion?: Expansion

    statsBySetNum?: Map<number | null, GlobalStats>

    findGlobalStats = () => {
        axios.get(`${StatsStore.CONTEXT}`)
            .then((response: AxiosResponse<GlobalStatsWithExpansion[]>) => {
                this.statsBySetNum = new Map()
                // log.debug(`Got stats: ${prettyJson(response.data)}`)
                response.data.forEach(stats => this.statsBySetNum!.set(stats.expansion, stats.stats))
                this.stats = this.statsBySetNum!.get(null)
            })
    }

    changeStats = (expansion?: Expansion) => {
        if (this.statsBySetNum != null) {
            if (expansion == null) {
                this.stats = this.statsBySetNum!.get(null)
            } else {
                this.stats = this.statsBySetNum!.get(expansion)
            }
            this.currentStatsExpansion = expansion
        }
    }

}

export const statsStore = new StatsStore()
