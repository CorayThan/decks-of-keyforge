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
        if (queryObject.cards) {
            if (typeof queryObject.cards === "string") {
                queryObject.cards = [queryObject.cards]
            }
            queryObject.cards = queryObject.cards.map((forQuery: string) => {
                const lastIndexOf = forQuery.lastIndexOf("-")
                return {
                    cardName: forQuery.substring(0, lastIndexOf),
                    quantity: Number(forQuery.substring(lastIndexOf + 1))
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
        if (queryObject.forTrade) {
            queryObject.forTrade = Boolean(queryObject.forTrade)
        }
        if (queryObject.forAuction) {
            queryObject.forAuction = Boolean(queryObject.forAuction)
        }
        if (queryObject.includeUnregistered) {
            queryObject.includeUnregistered = Boolean(queryObject.includeUnregistered)
        }
        if (queryObject.myFavorites) {
            queryObject.myFavorites = Boolean(queryObject.myFavorites)
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
    forTrade = false
    @observable
    forAuction = false
    @observable
    forSaleInCountry?: string
    @observable
    includeUnregistered = false
    @observable
    myFavorites: boolean = false
    constraints: Constraint[] = []
    @observable
    cards: DeckCardQuantity[] = [{
        cardName: "",
        quantity: 1
    }]
    @observable
    sortDirection: SortDirection = "DESC"
    @observable
    owner: string = ""
    pageSize = 20

    reset = () => {
        log.debug("Reseting deck filters.")
        this.title = ""
        this.forSale = false
        this.forTrade = false
        this.forAuction = false
        this.forSaleInCountry = undefined
        this.myFavorites = false
        this.includeUnregistered = false
        this.cards = [{
            cardName: "",
            quantity: 1
        }]
        this.constraints = []
        this.sortDirection = "DESC"
        this.owner = ""
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

    cleaned = () => {
        const cloned = clone(this)
        cloned.cards = cloned.cards.filter(card => card.cardName.length > 0)
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
        copied.cards = copied.cards.filter((card: DeckCardQuantity) => card.cardName.length > 0)
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
    cards.map(card => `${card.cardName}-${card.quantity}`)
)

const DefaultDeckFilters: any = new DeckFilters()

export interface DeckCardQuantity {
    cardName: string
    quantity: number
}
