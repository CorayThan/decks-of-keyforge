import { observable } from "mobx"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"
import { House } from "../houses/House"

export class DeckFilters {
    houses: House[] = []
    @observable
    title: string = ""
    page: number = 0
    sort: string = "ADDED_DATE"
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

interface DeckSortOption {
    name: string
    value: string
}

export const deckSortOptions: DeckSortOption[] = [
    { value: "ADDED_DATE", name: "Date Added" },
    { value: "SAS_RATING", name: "SAS Rating" },
    { value: "CARDS_RATING", name: "Card Rating" },
    { value: "SYNERGY", name: "Synergy" },
    { value: "ANTISYNERGY", name: "Antisynergy" },
    { value: "EXPECTED_AMBER", name: "Expected Amber" },
    { value: "TOTAL_CREATURE_POWER", name: "Total Creature Power" },
    { value: "CREATURE_COUNT", name: "Creature Count" },
    { value: "MAVERICK_COUNT", name: "Maverick Count" },
    { value: "RARES", name: "Rares" },
    { value: "SPECIALS", name: "Special Rarities" }
    ]
