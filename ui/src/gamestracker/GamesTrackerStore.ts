import axios, {AxiosResponse} from "axios"
import {makeObservable, observable} from "mobx"
import {HttpConfig} from "../config/HttpConfig"
import {GamesSet} from "../generated-src/GamesSet";
import {GamesSearchFilters} from "../generated-src/GamesSearchFilters";

export class GamesTrackerStore {
    static readonly CONTEXT = HttpConfig.API + "/games-tracker"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/games-tracker/secured"

    @observable
    games?: GamesSet

    @observable
    searching = false

    searchGames = async (filters: GamesSearchFilters) => {
        this.searching = true
        const response: AxiosResponse<GamesSet> = await axios.post(GamesTrackerStore.SECURE_CONTEXT + "/search-games", filters)
        this.searching = false
        this.games = response.data
    }

    constructor() {
        makeObservable(this)
    }
}

export const gamesTrackerStore = new GamesTrackerStore()
