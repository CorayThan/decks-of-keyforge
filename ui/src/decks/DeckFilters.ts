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
    sortDirection: SortDirection = "DESC"

    reset = () => {
        this.title = ""
        this.forSale = false
        this.forTrade = false
        this.containsMaverick = false
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleContainsMaverickUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.containsMaverick = event.target.checked
}
