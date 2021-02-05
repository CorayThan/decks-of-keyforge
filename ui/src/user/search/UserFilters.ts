import { isEqual } from "lodash"
import { makeObservable, observable } from "mobx"
import { Utils } from "../../config/Utils"
import { UserSort } from "../../generated-src/UserSort"

export class UserFilters {
    @observable
    favorites = false
    @observable
    friends = false
    @observable
    sort: UserSort = UserSort.DECK_COUNT
    @observable
    username = ""

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static rehydrateFromQuery = (queryObject: any): UserFilters => {
        // log.debug(`Rehydrating user filters from : ${prettyJson(queryObject)}`)

        if (queryObject.favorites != null) {
            queryObject.favorites = queryObject.favorites === "true"
        }
        if (queryObject.friends != null) {
            queryObject.friends = queryObject.friends === "true"
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters = new UserFilters()
        if (queryObject.favorites != null) {
            filters.favorites = queryObject.favorites === "true"
        }
        if (queryObject.friends != null) {
            filters.friends = queryObject.friends === "true"
        }
        if (queryObject.username != null) {
            filters.username = queryObject.username
        }
        if (queryObject.sort != null) {
            filters.sort = queryObject.sort
        }

        // log.debug(`Rehydrated user filters : ${prettyJson(filters)}`)
        return filters
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

export const prepareUserFiltersForQueryString = (filters: UserFilters): UserFilters => {
    const copied = Utils.jsonCopy(filters)

    Object.keys(copied).forEach((key: string) => {
        if (isEqual(copied[key], DefaultUserFilters[key])) {
            delete copied[key]
        }
    })

    return copied
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultUserFilters: any = new UserFilters()
