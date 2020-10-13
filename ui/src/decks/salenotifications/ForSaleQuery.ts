import { Utils } from "../../config/Utils"
import { DeckCardQuantity } from "../../generated-src/DeckCardQuantity"
import { House } from "../../generated-src/House"
import { KeyUser } from "../../user/KeyUser"
import { Constraint } from "../search/ConstraintDropdowns"
import { prepareDeckFiltersForQueryString } from "../search/DeckFilters"

export interface ForSaleQuery {
    queryName: string
    houses: House[]
    expansions: number[]
    title: string

    forSale: boolean
    forTrade: boolean
    forAuction: boolean
    forSaleInCountry?: string

    owner: string

    constraints: Constraint[]

    cards: DeckCardQuantity[]

    id?: string
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
