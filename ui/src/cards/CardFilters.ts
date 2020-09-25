import { isEqual } from "lodash"
import { observable } from "mobx"
import * as React from "react"
import { Utils } from "../config/Utils"
import { Constraint } from "../decks/search/ConstraintDropdowns"
import { constraintsAsParam } from "../decks/search/DeckFilters"
import { Expansion } from "../generated-src/Expansion"
import { House } from "../generated-src/House"
import { Rarity } from "../generated-src/Rarity"
import { SynergyTrait } from "../generated-src/SynergyTrait"
import { SortDirection } from "../generic/SortDirection"
import { CardType } from "./CardType"

export class CardFilters {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static rehydrateFromQuery = (queryObject: any): CardFilters => {
        // log.debug(`Rehydrating from : ${prettyJson(queryObject)}`)
        if (typeof queryObject.houses === "string") {
            queryObject.houses = [queryObject.houses]
        }
        if (typeof queryObject.types === "string") {
            queryObject.types = [queryObject.types]
        }
        if (typeof queryObject.rarities === "string") {
            queryObject.rarities = [queryObject.rarities]
        }
        if (typeof queryObject.minAdaptiveScore === "string") {
            queryObject.minAdaptiveScore = Number(queryObject.minAdaptiveScore)
        }
        if (typeof queryObject.powers === "string") {
            queryObject.powers = [Number(queryObject.powers)]
        } else if (queryObject.powers != null) {
            queryObject.powers = queryObject.powers.map((val: string) => Number(val))
        }
        if (typeof queryObject.ambers === "string") {
            queryObject.ambers = [Number(queryObject.ambers)]
        } else if (queryObject.ambers != null) {
            queryObject.ambers = queryObject.ambers.map((val: string) => Number(val))
        }
        if (queryObject.expansions != null) {
            if (queryObject.expansions.constructor === Array) {
                queryObject.expansions = queryObject.expansions.map((expansion: string) => Number(expansion))
            } else {
                const expansionAsNumber = Number(queryObject.expansions)
                queryObject.expansions = [expansionAsNumber]
            }
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
        if (queryObject.aercHistory) {
            queryObject.aercHistory = queryObject.aercHistory === "true"
        }
        if (queryObject.thisExpansionOnly) {
            queryObject.thisExpansionOnly = queryObject.thisExpansionOnly === "true"
        }
        if (queryObject.aercHistoryDate === "") {
            queryObject.aercHistoryDate = undefined
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filters = new CardFilters() as any
        Object.keys(queryObject).forEach(key => filters[key] = queryObject[key])
        // log.debug(`Rehydrated to: ${prettyJson(filters)}`)
        return filters
    }

    @observable
    title = ""
    @observable
    description = ""
    rarities: Rarity[] = []
    types: CardType[] = []
    houses: House[] = []
    powers: number[] = []
    ambers: number[] = []
    @observable
    minAdaptiveScore?: number
    @observable
    trait?: SynergyTrait
    @observable
    synergy?: SynergyTrait
    expansion?: Expansion
    thisExpansionOnly?: boolean
    constraints: Constraint[] = []

    @observable
    aercHistory?: boolean
    aercHistoryDate?: string

    sort?: CardSort
    @observable
    sortDirection: SortDirection = "DESC"

    reset = () => {
        this.title = ""
        this.description = ""
        this.sortDirection = "DESC"
        this.rarities = []
        this.types = []
        this.houses = []
        this.powers = []
        this.ambers = []
        this.minAdaptiveScore = undefined
        this.trait = undefined
        this.constraints = []
        this.synergy = undefined
        this.expansion = undefined
        this.thisExpansionOnly = undefined
        this.sort = undefined
        this.aercHistory = undefined
        this.aercHistoryDate = undefined
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleDescriptionUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.description = event.target.value
}

export const prepareCardFiltersForQueryString = (filters: CardFilters): CardFilters => {
    const copied = Utils.jsonCopy(filters)

    Object.keys(copied).forEach((key: string) => {
        if (isEqual(copied[key], DefaultCardFilters[key])) {
            delete copied[key]
        }
    })

    if (copied.constraints) {
        copied.constraints = constraintsAsParam(copied.constraints)
    }

    return copied
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultCardFilters: any = new CardFilters()

export enum CardSort {
    EXPECTED_AMBER = "EXPECTED_AMBER",
    AMBER_CONTROL = "AMBER_CONTROL",
    CREATURE_CONTROL = "CREATURE_CONTROL",
    ARTIFACT_CONTROL = "ARTIFACT_CONTROL",
    RELATIVE_WIN_RATE = "RELATIVE_WIN_RATE",
    WIN_RATE = "WIN_RATE",
    SET_NUMBER = "SET_NUMBER",
    AERC = "AERC",
    NAME = "NAME",
}
