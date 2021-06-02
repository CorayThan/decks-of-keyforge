import { makeObservable, observable } from "mobx"
import { log } from "../config/Utils"
import { UpdatePrice } from "../generated-src/UpdatePrice"

class DeckTableViewStore {
    @observable
    priceChanges: UpdatePrice[] = []

    @observable
    selectedDecks: number[] = []

    addPriceChange = (auctionId: string, askingPrice?: number) => {
        log.debug("Add price change for " + auctionId + " change: " + askingPrice)
        this.priceChanges = this.priceChanges.filter(priceChange => priceChange.auctionId !== auctionId)
        this.priceChanges.push({auctionId, askingPrice})
    }

    toggleDeckSelected = (deckId: number) => {
        if (!this.selectedDecks.includes(deckId)) {
            this.selectedDecks.push(deckId)
        } else {
            this.selectedDecks = this.selectedDecks.filter(selId => selId !== deckId)
        }
    }

    constructor() {
        makeObservable(this)
    }

    reset = () => {
        this.priceChanges = []
        this.selectedDecks = []
    }
}

export const deckTableViewStore = new DeckTableViewStore()
