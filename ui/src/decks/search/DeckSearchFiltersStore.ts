import { observable } from "mobx"

class DeckSearchFiltersStore {

    @observable
    adaptiveScoreFilter?: number

    reset = () => {
        this.adaptiveScoreFilter = undefined
    }
}

export const deckSearchFiltersStore = new DeckSearchFiltersStore()
