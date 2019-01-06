import { observable } from "mobx"
import * as React from "react"
import { SortDirection } from "../../generic/SortDirection"
import { House } from "../../houses/House"

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
    myDecks: boolean = false
    sortDirection: SortDirection = "DESC"
    owner: string = ""

    reset = () => {
        this.title = ""
        this.forSale = false
        this.forTrade = false
        this.containsMaverick = false
        this.myDecks = false
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleContainsMaverickUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.containsMaverick = event.target.checked
    handleMyDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.myDecks = event.target.checked
}

export const DeckFiltersInstance = new DeckFilters()
