import { clone, isEqual } from "lodash"
import { observable } from "mobx"
import * as React from "react"
import { log, prettyJson, Utils } from "../../config/Utils"
import { SortDirection } from "../../generic/SortDirection"
import { House } from "../../houses/House"
import { userStore } from "../../user/UserStore"
import { defaultSort } from "../selects/DeckSortSelect"
import { Constraint } from "./ConstraintDropdowns"

export class DeckFilters {

    static forSaleOrTrade = () => {
        const filters = new DeckFilters()
        filters.forSale = true
        filters.forTrade = true
        filters.forAuction = true
        filters.includeUnregistered = true
        return filters
    }

    static rehydrateFromQuery = (queryObject: any): DeckFilters => {
        log.debug(`Rehydrating from : ${prettyJson(queryObject)}`)
        if (typeof queryObject.houses === "string") {
            queryObject.houses = [queryObject.houses]
        }
        log.debug(`Expansions is: ${queryObject.expansions}`)
        if (queryObject.expansions != null) {
            if (queryObject.expansions.constructor === Array) {
                queryObject.expansions = queryObject.expansions.map((expansion: string) => Number(expansion))
            } else {
                const expansionAsNumber = Number(queryObject.expansions)
                queryObject.expansions = [expansionAsNumber]
            }
        }
        if (queryObject.cards) {
            if (typeof queryObject.cards === "string") {
                queryObject.cards = [queryObject.cards]
            }
            queryObject.cards = queryObject.cards.map((forQuery: string) => {
                const lastIndexOf = forQuery.lastIndexOf("-")
                const secondPart = forQuery.substring(lastIndexOf + 1)
                const quantity = isNaN(Number(secondPart)) ? undefined : Number(secondPart)
                let house
                if (quantity == null) {
                    house = secondPart as House
                }
                return {
                    cardNames: forQuery.substring(0, lastIndexOf).split(cardSeparator),
                    quantity,
                    house
                }
            })
        }
        if (queryObject.constraints) {
            if (typeof queryObject.constraints === "string") {
                queryObject.constraints = [queryObject.constraints]
            }
            queryObject.constraints = queryObject.constraints.map((forQuery: string) => {
                const split = forQuery.split("-")
                return {
                    property: split[0],
                    cap: split[1],
                    value: Number(split[2])
                }
            })
        }
        if (queryObject.page) {
            queryObject.page = Number(queryObject.page)
        }
        if (queryObject.forSale) {
            queryObject.forSale = Boolean(queryObject.forSale)
        }
        if (queryObject.notForSale) {
            queryObject.notForSale = Boolean(queryObject.notForSale)
        }
        if (queryObject.forTrade) {
            queryObject.forTrade = Boolean(queryObject.forTrade)
        }
        if (queryObject.forAuction) {
            queryObject.forAuction = Boolean(queryObject.forAuction)
        }
        if (queryObject.completedAuctions) {
            queryObject.completedAuctions = Boolean(queryObject.completedAuctions)
        }
        if (queryObject.includeUnregistered) {
            queryObject.includeUnregistered = Boolean(queryObject.includeUnregistered)
        }
        if (queryObject.myFavorites) {
            queryObject.myFavorites = Boolean(queryObject.myFavorites)
        }
        if (queryObject.withOwners) {
            queryObject.withOwners = Boolean(queryObject.withOwners)
        }

        const filters = new DeckFilters() as any
        Object.keys(queryObject).forEach(key => filters[key] = queryObject[key])
        // log.debug(`Rehydrated to: ${prettyJson(filters)}`)
        return filters
    }

    houses: House[] = []
    @observable
    title: string = ""
    page: number = 0
    @observable
    sort: string = defaultSort.value
    @observable
    forSale = false
    @observable
    notForSale = false
    @observable
    forTrade = false
    @observable
    forAuction = false
    @observable
    withOwners = false
    @observable
    completedAuctions = false
    @observable
    forSaleInCountry?: string
    @observable
    includeUnregistered = false
    @observable
    myFavorites: boolean = false
    constraints: Constraint[] = []
    expansions: number[] = []
    @observable
    cards: DeckCardQuantity[] = []
    @observable
    sortDirection: SortDirection = "DESC"
    @observable
    owner: string = ""
    pageSize = 20

    reset = () => {
        log.debug("Reseting deck filters.")
        this.title = ""
        this.forSale = false
        this.notForSale = false
        this.forTrade = false
        this.forAuction = false
        this.completedAuctions = false
        this.forSaleInCountry = undefined
        this.myFavorites = false
        this.includeUnregistered = false
        this.cards = []
        this.expansions = []
        this.constraints = []
        this.sortDirection = "DESC"
        this.owner = ""
        this.withOwners = false
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleMyDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const username = userStore.username
            this.owner = username ? username : ""
        } else {
            this.owner = ""
        }
    }
    handleMyFavoritesUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.myFavorites = event.target.checked

    handleCompletedAuctionsUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.completedAuctions = event.target.checked
        this.forSale = false
        this.forTrade = false
    }

    cleaned = () => {
        const cloned = clone(this)
        cloned.cards = cloned.cards.filter(card => card.cardNames.length > 0 && card.cardNames[0].length > 0)
        return cloned
    }
}

export const prepareDeckFiltersForQueryString = (filters: DeckFilters): DeckFilters => {
    const copied = Utils.jsonCopy(filters)

    Object.keys(copied).forEach((key: string) => {
        if (isEqual(copied[key], DefaultDeckFilters[key])) {
            delete copied[key]
        }
    })

    if (copied.forSaleInCountry == null || copied.forSaleInCountry === "") {
        delete copied.forSaleInCountry
    }

    if (copied.cards) {
        copied.cards = copied.cards.filter((card: DeckCardQuantity) => card.cardNames != null && card.cardNames[0] != null && card.cardNames[0].length > 0)
        copied.cards = cardsAsParam(copied.cards)
    }
    if (copied.constraints) {
        copied.constraints = constraintsAsParam(copied.constraints)
    }
    return copied
}

const constraintsAsParam = (constraints: Constraint[]) => (
    constraints.map(constraint => `${constraint.property}-${constraint.cap}-${constraint.value}`)
)

const cardsAsParam = (cards: DeckCardQuantity[]) => (
    cards.map(card => `${card.cardNames.join(cardSeparator)}-${card.house ? card.house : card.quantity}`)
)

// tslint:disable-next-line:no-any
const DefaultDeckFilters: any = new DeckFilters()

export interface DeckCardQuantity {
    cardNames: string[]
    quantity: number
    house?: House
}

export const cardSeparator = "~or~"
