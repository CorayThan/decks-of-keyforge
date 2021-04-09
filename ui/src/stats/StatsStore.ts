import axios, { AxiosResponse } from "axios"
import { get, set } from "idb-keyval"
import { makeObservable, observable } from "mobx"
import { cardStore } from "../cards/CardStore"
import { HttpConfig } from "../config/HttpConfig"
import { IdbUtils } from "../config/IdbUtils"
import { log } from "../config/Utils"
import { ExpansionNumber, expansionToBackendExpansion } from "../expansions/Expansions"
import { Expansion } from "../generated-src/Expansion"
import { GlobalStats } from "../generated-src/GlobalStats"
import { GlobalStatsWithExpansion } from "../generated-src/GlobalStatsWithExpansion"
import { House } from "../generated-src/House"

export class StatsStore {
    static readonly CONTEXT = HttpConfig.API + "/stats"
    private statsKey = "stats"

    @observable
    stats?: GlobalStats

    @observable
    currentStatsExpansion?: ExpansionNumber

    statsBySetNum?: Map<number | null, GlobalStats>

    // expansion-house
    winsByExpansionAndHouse: { [key: string]: number } = {}

    findGlobalStats = async () => {

        let globalStats: GlobalStatsWithExpansion[]
        if (IdbUtils.idbAvailable) {

            const lastUpdateResponse: AxiosResponse<string> = await axios.get(`${StatsStore.CONTEXT}/completed-date`)
            const lastUpdateDate = lastUpdateResponse.data

            const idbStats: GlobalStatsWithExpansion[] = (await get(this.statsKey)) ?? []
            const lastUpdateFromDb = idbStats.find(idbStat => idbStat.completedDate != null)?.completedDate

            if (lastUpdateDate == null || lastUpdateFromDb !== lastUpdateDate) {
                log.info(`Found new stats from ${lastUpdateDate}. Replacing stats from ${lastUpdateFromDb}`)
                globalStats = await this.requestStatsFromServer()
                await set(this.statsKey, globalStats)
            } else {
                log.info(`Using cached stats from ${lastUpdateFromDb}`)
                globalStats = idbStats
            }
        } else {
            log.info("IDB unavailable in stats store.")
            globalStats = await this.requestStatsFromServer()
        }

        this.statsBySetNum = new Map()
        // log.debug(`Got stats: ${prettyJson(response.data)}`)
        globalStats.forEach(stats => {
            if (stats.expansion != null) {
                stats.stats.houseWinRate?.forEach(houseWinRate => {
                    this.winsByExpansionAndHouse[`${expansionToBackendExpansion(stats.expansion!)}-${houseWinRate.x}`] = houseWinRate.y
                })
            }
            this.statsBySetNum!.set(stats.expansion == null ? null : stats.expansion, stats.stats)
        })
        this.stats = this.statsBySetNum!.get(null)

        cardStore.setupCardWinRates()

    }

    private requestStatsFromServer = async () => {
        const statsResponse: AxiosResponse<GlobalStatsWithExpansion[]> = await axios.get(`${StatsStore.CONTEXT}`)
        return statsResponse.data
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
