import { isEqual } from "lodash"
import { makeObservable, observable } from "mobx"
import * as React from "react"
import { Utils } from "../config/Utils"
import { constraintsAsParam } from "../decks/search/DeckFilters"
import { CardType } from "../generated-src/CardType"
import { Constraint } from "../generated-src/Constraint"
import { House } from "../generated-src/House"
import { Rarity } from "../generated-src/Rarity"
import { SynergyTrait } from "../generated-src/SynergyTrait"
import { SortDirection } from "../generic/SortDirection"
import { queryParamsFromObject, SearchFiltersBuilder } from "../config/SearchFiltersBuilder"

export class CardFilters {

    static rehydrateFromQuery = (params: string): CardFilters => {
        // log.debug(`Rehydrating from : ${prettyJson(queryObject)}`)

        return new SearchFiltersBuilder(params, new CardFilters())
            .stringArrayValue("houses")
            .stringArrayValue("types")
            .stringArrayValue("rarities")
            .numberArrayValue("powers")
            .numberArrayValue("ambers")
            .numberArrayValue("expansions")
            .numberArrayValue("excludedExpansions")
            .value("aercHistory")
            .customArrayValue("constraints", (val: string) => {
                const split = val.split("-")
                return {
                    property: split[0],
                    cap: split[1],
                    value: Number(split[2])
                }
            })
            .build()
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
    trait?: SynergyTrait
    @observable
    synergy?: SynergyTrait
    expansions: number[] = []
    excludedExpansions: number[] = []
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
        this.trait = undefined
        this.constraints = []
        this.synergy = undefined
        this.expansions = []
        this.excludedExpansions = []
        this.sort = undefined
        this.aercHistory = undefined
        this.aercHistoryDate = undefined
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleDescriptionUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.description = event.target.value

    constructor() {
        makeObservable(this)
    }
}

export const cardFiltersToQueryString = (filters: CardFilters) => {
    const copied = Utils.jsonCopy(filters)

    Object.keys(copied).forEach((key: string) => {
        if (isEqual(copied[key], DefaultCardFilters[key])) {
            delete copied[key]
        }
    })

    if (copied.constraints) {
        copied.constraints = constraintsAsParam(copied.constraints)
    }

    return queryParamsFromObject(copied)
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
