import { clone } from "lodash"
import { observable } from "mobx"
import * as React from "react"
import { SortDirection } from "../../generic/SortDirection"
import { House } from "../../houses/House"
import { Constraint } from "./ConstraintDropdowns"

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
    constraints: Constraint[] = []
    @observable
    cards: DeckCardQuantity[] = [{
        cardName: "",
        quantity: 1
    }]
    sortDirection: SortDirection = "DESC"
    owner: string = ""

    reset = () => {
        this.title = ""
        this.forSale = false
        this.forTrade = false
        this.containsMaverick = false
        this.myDecks = false
        this.cards = [{
            cardName: "",
            quantity: 1
        }]
        this.constraints = []
    }

    handleTitleUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.title = event.target.value
    handleContainsMaverickUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.containsMaverick = event.target.checked
    handleMyDecksUpdate = (event: React.ChangeEvent<HTMLInputElement>) => this.myDecks = event.target.checked

    cleaned = () => {
        const cloned = clone(this)
        cloned.cards = cloned.cards.filter(card => card.cardName.length > 0 && card.quantity > 0)
        return cloned
    }
}

interface DeckCardQuantity {
    cardName: string
    quantity: number
}

export const DeckFiltersInstance = new DeckFilters()
