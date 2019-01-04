import axios, { AxiosResponse } from "axios"
import { clone } from "lodash"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { log } from "../config/Utils"
import { DeckPage, DeckWithSynergyInfo } from "./Deck"
import { DeckSaleInfo } from "./sales/DeckSaleInfo"
import { DeckFilters } from "./search/DeckFilters"

export class DeckStore {

    static readonly CONTEXT = HttpConfig.API + "/decks/public"
    private static innerInstance: DeckStore

    @observable
    deckPage?: DeckPage

    @observable
    nextDeckPage?: DeckPage

    @observable
    currentFilters?: DeckFilters

    @observable
    searchingForDecks = false

    @observable
    addingMoreDecks = false

    @observable
    deck?: DeckWithSynergyInfo

    @observable
    saleInfo?: DeckSaleInfo[]

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    reset = () => {
        this.deckPage = undefined
    }

    findDeck = (keyforgeId: string) => {
        axios.get(`${DeckStore.CONTEXT}/${keyforgeId}`)
            .then((response: AxiosResponse) => {
                this.deck = response.data
            })
    }

    findDeckSaleInfo = (keyforgeId: string) => {
        axios.get(`${DeckStore.CONTEXT}/${keyforgeId}/sale-info`)
            .then((response: AxiosResponse) => {
                this.saleInfo = response.data
            })
    }

    searchDecks = async (filters: DeckFilters) => {
        log.debug(`Sorting by ${filters.sort}`)
        this.searchingForDecks = true
        this.currentFilters = clone(filters)
        this.nextDeckPage = undefined
        const decks = await this.findDecks(filters)
        if (decks) {
            this.deckPage = observable(decks)
            log.debug(`Current decks page ${decks.page}. Total pages ${decks.pages}.`)
        }
        this.searchingForDecks = false
        this.findNextDecks()
    }

    findNextDecks = async () => {
        if (this.currentFilters && this.moreDecksAvailable()) {
            this.addingMoreDecks = true
            this.currentFilters.page++
            const decks = await this.findDecks(this.currentFilters)
            if (decks) {
                this.addingMoreDecks = false
                this.nextDeckPage = decks
            }
        }
    }

    showMoreDecks = () => {
        if (this.deckPage && this.nextDeckPage) {
            this.deckPage.decks.push(...this.nextDeckPage.decks)
            this.deckPage.page++
            this.deckPage.pages = this.nextDeckPage.pages
            this.nextDeckPage = undefined
            log.debug(`Current decks page ${this.deckPage.page}. Total pages ${this.deckPage.pages}.`)
            this.findNextDecks()
        }
    }

    moreDecksAvailable = () => this.deckPage && this.deckPage.page + 1 < this.deckPage.pages

    private findDecks = async (filters: DeckFilters) => new Promise<DeckPage>(resolve => {
        axios.post(`${DeckStore.CONTEXT}/filter`, filters)
            .then((response: AxiosResponse) => {
                // log.debug(`With filters: ${prettyJson(filters)} Got the filtered decks. decks: ${prettyJson(response.data)}`)
                resolve(response.data)
            })
            .catch(() => {
                resolve()
            })
    })

}