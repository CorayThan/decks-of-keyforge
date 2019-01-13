import { observable } from "mobx"
import * as React from "react"
import { SortDirection } from "../generic/SortDirection"
import { House } from "../houses/House"
import { CardType } from "./CardType"
import { Rarity } from "./rarity/Rarity"

export class CardFilters {
    @observable
    title = ""
    @observable
    description = ""
    rarities: Rarity[] = []
    types: CardType[] = []
    houses: House[] = []
    powers: number[] = []
    ambers: number[] = []
    armors: number[] = []
    sort?: string
    @observable
    sortDirection: SortDirection = "ASC"

    reset = () => {
        this.title = ""
        this.description = ""
        this.sortDirection = "ASC"
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleDescriptionUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.description = event.target.value
}
