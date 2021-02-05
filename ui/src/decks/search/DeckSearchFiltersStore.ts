import { makeObservable, observable } from "mobx"

class DeckSearchFiltersStore {
    @observable
    adaptiveScoreFilter?: number

    reset = () => {
        this.adaptiveScoreFilter = undefined
    }

    constructor() {
        makeObservable(this)
    }
}

export const deckSearchFiltersStore = new DeckSearchFiltersStore()
