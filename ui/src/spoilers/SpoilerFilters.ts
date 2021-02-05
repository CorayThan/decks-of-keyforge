import { makeObservable, observable } from "mobx"
import * as React from "react"
import { CardType } from "../cards/CardType"
import { House } from "../generated-src/House"
import { Rarity } from "../generated-src/Rarity"

export class SpoilerFilters {
    @observable
    title = ""
    @observable
    description = ""
    rarities: Rarity[] = []
    types: CardType[] = []
    houses: House[] = []
    powers: number[] = []
    ambers: number[] = []
    expansion?: number

    @observable
    anomaly = false

    @observable
    reprints = true

    @observable
    newCards = true

    reset = () => {
        this.title = ""
        this.description = ""
        this.anomaly = false
        this.reprints = true
        this.newCards = true
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleDescriptionUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.description = event.target.value

    constructor() {
        makeObservable(this)
    }
}
