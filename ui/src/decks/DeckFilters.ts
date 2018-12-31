import { observable } from "mobx"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"
import { House } from "../houses/House"

export class DeckFilters {
    houses: House[] = []
    @observable
    title: string = ""
    page: number = 0
    sort: DeckSortOptions = "ADDED_DATE"
    @observable
    forSale = false
    @observable
    forTrade = false
    @observable
    containsMaverick: boolean = false
    @observable
    sortDirection: SortDirection = "ASC"

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleContainsMaverickUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.containsMaverick = event.target.checked
}

export type DeckSortOptions =
    "ADDED_DATE"
    | "DECK_NAME"
    | "AMBER"
    | "POWER"
    | "MAVERICK_COUNT"
    | "RARES"
    | "SPECIALS"
    | "CARDS_RATING"
