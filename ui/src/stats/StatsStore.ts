import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { cardStore } from "../cards/CardStore"
import { HttpConfig } from "../config/HttpConfig"
import { ExpansionNumber, expansionToBackendExpansion } from "../expansions/Expansions"
import { Expansion } from "../generated-src/Expansion"
import { GlobalStats } from "../generated-src/GlobalStats"
import { GlobalStatsWithExpansion } from "../generated-src/GlobalStatsWithExpansion"
import { House } from "../generated-src/House"

export class StatsStore {
    static readonly CONTEXT = HttpConfig.API + "/stats"

    @observable
    stats?: GlobalStats

    @observable
    currentStatsExpansion?: ExpansionNumber

    statsBySetNum?: Map<number | null, GlobalStats>

    // expansion-house
    winsByExpansionAndHouse: { [key: string]: number } = {}

    findGlobalStats = () => {
        axios.get(`${StatsStore.CONTEXT}`)
            .then((response: AxiosResponse<GlobalStatsWithExpansion[]>) => {
                this.statsBySetNum = new Map()
                // log.debug(`Got stats: ${prettyJson(response.data)}`)
                response.data.forEach(stats => {
                    if (stats.expansion != null) {
                        stats.stats.houseWinRate?.forEach(houseWinRate => {
                            this.winsByExpansionAndHouse[`${expansionToBackendExpansion(stats.expansion!)}-${houseWinRate.x}`] = houseWinRate.y
                        })
                    }
                    this.statsBySetNum!.set(stats.expansion == null ? null : stats.expansion, stats.stats)
                })
                this.stats = this.statsBySetNum!.get(null)

                cardStore.setupCardWinRates()
            })
    }

    changeStats = (expansion?: ExpansionNumber) => {
        if (this.statsBySetNum != null) {
            if (expansion == null) {
                this.stats = this.statsBySetNum!.get(null)
            } else {
                this.stats = this.statsBySetNum!.get(expansion)
            }
            this.currentStatsExpansion = expansion
        }
    }

    winRateForExpansionAndHouse = (expansion: Expansion, house: House): number | undefined => {
        const wins = this.winsByExpansionAndHouse
        if (wins != null) {
            return wins[`${expansion}-${house}`]
        }
    }

    constructor() {
        makeObservable(this)
    }
}

export const statsStore = new StatsStore()
