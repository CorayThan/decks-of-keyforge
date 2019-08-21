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
    ratings: number[] = []
    ambers: number[] = []
    armors: number[] = []
    expansion?: number
    sort?: CardSort
    @observable
    sortDirection: SortDirection = "DESC"

    reset = () => {
        this.title = ""
        this.description = ""
        this.sortDirection = "DESC"
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleDescriptionUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.description = event.target.value
}

export enum CardSort {
    CARD_RATING = "CARD_RATING",
    EXPECTED_AMBER = "EXPECTED_AMBER",
    AMBER_CONTROL = "AMBER_CONTROL",
    CREATURE_CONTROL = "CREATURE_CONTROL",
    ARTIFACT_CONTROL = "ARTIFACT_CONTROL",
    WIN_RATE = "WIN_RATE",
    SET_NUMBER = "SET_NUMBER",
    AERC = "AERC"
}
