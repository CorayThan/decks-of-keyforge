import { clone, isEqual } from "lodash"
import { makeObservable, observable } from "mobx"
import * as React from "react"
import { log, Utils } from "../../config/Utils"
import { Constraint } from "../../generated-src/Constraint"
import { DeckCardQuantity } from "../../generated-src/DeckCardQuantity"
import { House } from "../../generated-src/House"
import { SaleNotificationQueryDto } from "../../generated-src/SaleNotificationQueryDto"
import { userStore } from "../../user/UserStore"
import { defaultSort } from "../selects/DeckSortSelect"
import { queryParamsFromObject, SearchFiltersBuilder } from "../../config/SearchFiltersBuilder"
import { SortDirection } from "../../generated-src/SortDirection"
import { DeckSortOptions } from "../../generated-src/DeckSortOptions"

export class DeckFilters {
    static forSale = () => {
        const filters = new DeckFilters()
        filters.forSale = true
        return filters
    }

    static rehydrateFromQuery = (params: string): DeckFilters => {
        // log.debug(`Rehydrating deck filters from : ${prettyJson(params)}`)

        const built = new SearchFiltersBuilder(params, new DeckFilters())
            .value("title")
            .value("notes")
            .value("notesUser")
            .value("page")
            .value("sort")
            .value("forSaleInCountry")
            .value("sortDirection")
            .value("owner")
            .value("previousOwner")
            .value("teamDecks")
            .value("withOwners")
            .value("myFavorites")
            .value("forTrade")
            .value("notForSale")
            .value("forSale")
            .value("titleQl")
            .value("listedWithinDays")

            .stringArrayValue("houses")
            .stringArrayValue("excludeHouses")
            .numberArrayValue("expansions")
            .numberArrayValue("tags")
            .stringArrayValue("tokens")
            .stringArrayValue("owners")
            .stringArrayValue("tournamentIds")
            .numberArrayValue("notTags")
            .customArrayValue("cards", (val: string) => {
                const lastIndexOf = val.lastIndexOf("-")
                const secondPart = val.substring(lastIndexOf + 1)
                const quantity = isNaN(Number(secondPart)) ? undefined : Number(secondPart)
                let house
                let mav = undefined
                if (quantity == null) {
                    if (secondPart === "Maverick") {
                        mav = true
                    } else {
                        house = secondPart as House
                    }
                }
                return {
                    cardNames: val.substring(0, lastIndexOf).split(cardSeparator),
                    quantity,
                    house,
                    mav
                }
            })
            .customArrayValue("constraints", (val: string) => {
                const split = val.split(val.includes("_") ? "_" : "-")
                let property = split[0]
                if (property === "askingPrice") {
                    // temp to fix these urls
                    property = "buyItNow"
                }
                log.debug("From constraint: " + val)
                log.debug(`Found ${property} ${split[1]} ${Number(split[2])}`)
                return {
                    property,
                    cap: split[1],
                    value: Number(split[2])
                }
            })
            .build()

        // log.debug(`Rehydrated to: ${prettyJson(built)}`)
        return built
    }

    houses: House[] = []
    excludeHouses: House[] = []
    @observable
    title = ""
    @observable
    notes = ""
    @observable
    tags: number[] = []
    @observable
    notTags: number[] = []
    @observable
    notesUser = ""
    page = 0
    @observable
    sort: DeckSortOptions = defaultSort.value
    @observable
    titleQl = false
    @observable
    forSale?: boolean
    @observable
    notForSale = false
    @observable
    forTrade = false
    @observable
    withOwners = false
    @observable
    teamDecks = false
    @observable
    forSaleInCountry?: string
    @observable
    myFavorites = false
    constraints: Constraint[] = []
    expansions: number[] = []
    @observable
    cards: DeckCardQuantity[] = []
    @observable
    tokens: string[] = []
    @observable
    sortDirection: SortDirection = SortDirection.DESC
    @observable
    owner = ""
    @observable
    owners: string[] = []
    @observable
    tournamentIds: number[] = []
    @observable
    listedWithinDays?: number
    @observable
    previousOwner = ""
    pageSize = 20

    reset = () => {
        this.title = ""
        this.notes = ""
        this.notesUser = ""
        this.forSale = undefined
        this.notForSale = false
        this.forTrade = false
        this.forSaleInCountry = undefined
        this.myFavorites = false
        this.cards = []
        this.tokens = []
        this.expansions = []
        this.constraints = []
        this.houses = []
        this.excludeHouses = []
        this.tags = []
        this.notTags = []
        this.sortDirection = SortDirection.DESC
        this.owner = ""
        this.owners = []
        this.previousOwner = ""
        this.withOwners = false
        this.teamDecks = false
        this.tournamentIds = []
        this.titleQl = false
        this.listedWithinDays = undefined
    }

    handleListedWithinDaysUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        log.info("Listed within days to " + event.target.value)
        if (event.target.value === "") {
            log.info("Listed within days to undefined??")
            this.listedWithinDays = undefined
        } else {
            this.listedWithinDays = Number(event.target.value)
        }
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
    handleMyPreviouslyOwnedDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const username = userStore.username
            this.previousOwner = username ? username : ""
        } else {
            this.previousOwner = ""
        }
    }
    handleMyFavoritesUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.myFavorites = event.target.checked
    }

    cleaned = () => {
        const cloned = clone(this)
        cloned.cards = cloned.cards.filter(card => card.cardNames.length > 0 && card.cardNames[0].length > 0)
        return cloned
    }

    constructor() {
        makeObservable(this)
    }

    get isForSaleOrTrade() {
        return this.forTrade || this.forSale
    }
}

export const deckFiltersToQueryString = (filters: DeckFilters | SaleNotificationQueryDto) => {
    const copied = Utils.jsonCopy(filters)

    Object.keys(copied).forEach((key: string) => {
        if (isEqual(copied[key], DefaultDeckFilters[key])) {
            delete copied[key]
        }
    })

    if (copied.forSaleInCountry == null || copied.forSaleInCountry === "") {
        delete copied.forSaleInCountry
    }

    if (copied.userId != null) {
        delete copied.userId
    }

    if (copied.forSale == null) {
        delete copied.forSale
    }

    if (copied.listedWithinDays == null) {
        delete copied.listedWithinDays
    }

    if (copied.cards) {
        copied.cards = copied.cards.filter((card: DeckCardQuantity) => card.cardNames != null && card.cardNames[0] != null && card.cardNames[0].length > 0)
        if (copied.cards.length > 0) {
            copied.cards = cardsAsParam(copied.cards)
        } else {
            delete copied.cards
        }
    }
    if (copied.constraints && copied.constraints.length > 0) {
        copied.constraints = constraintsAsParam(copied.constraints)
    }

    return queryParamsFromObject(copied)
}

export const constraintsAsParam = (constraints: Constraint[]) => (
    constraints.map(constraint => `${constraint.property}_${constraint.cap}_${constraint.value}`)
)

const cardsAsParam = (cards: DeckCardQuantity[]) => (
    cards.map(card => `${card.cardNames.join(cardSeparator)}-${card.house ? card.house : (card.mav ? "Maverick" : card.quantity)}`)
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultDeckFilters: any = new DeckFilters()

export const cardSeparator = "~or~"
