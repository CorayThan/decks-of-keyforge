import { makeObservable, observable } from "mobx"
import { UserSort } from "../../generated-src/UserSort"
import { SearchFiltersBuilder } from "../../config/SearchFiltersBuilder"

export class UserFilters {
    @observable
    favorites = false
    @observable
    friends = false
    @observable
    sort: UserSort = UserSort.DECK_COUNT
    @observable
    username = ""

    static rehydrateFromQuery = (params: string): UserFilters => {
        // log.debug(`Rehydrating user filters from : ${prettyJson(queryObject)}`)

        return new SearchFiltersBuilder(params, new UserFilters())
            .value("favorites")
            .value("friends")
            .value("username")
            .value("sort")
            .value("")
            .build()
    }

    reset = () => {
        this.favorites = false
        this.friends = false
        this.sort = UserSort.DECK_COUNT
        this.username = ""
    }

    constructor() {
        makeObservable(this)
    }
}
