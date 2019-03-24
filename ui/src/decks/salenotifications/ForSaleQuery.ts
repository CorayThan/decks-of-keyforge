import { Utils } from "../../config/Utils"
import { House } from "../../houses/House"
import { KeyUser } from "../../user/KeyUser"
import { Constraint } from "../search/ConstraintDropdowns"
import { DeckCardQuantity, prepareDeckFiltersForQueryString } from "../search/DeckFilters"

export interface ForSaleQuery {
    queryName: string
    houses: House[]
    title: string

    forSale: boolean
    forTrade: boolean
    forSaleInCountry?: string
    includeUnregistered: boolean

    owner: string

    constraints: Constraint[]

    cards: DeckCardQuantity[]
}

export interface ForSaleQueryEntity {
    name: string
    json: string
    user?: KeyUser
    active: boolean
    id: string
}

export const prepareForSaleQueryForQueryString = (filters: ForSaleQuery) => {
    const copied = Utils.jsonCopy(filters)
    delete copied.queryName
    return prepareDeckFiltersForQueryString(copied)
}
