import axios, { AxiosResponse, CancelTokenSource } from "axios"
import { clone } from "lodash"
import { observable } from "mobx"
import { closeAllMenuStoresExcept, rightMenuStore } from "../components/KeyTopbar"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { messageStore } from "../ui/MessageStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { Deck, DeckCount, DeckPage, DeckWithSynergyInfo } from "./Deck"
import { DeckSaleInfo } from "./sales/DeckSaleInfo"
import { DeckFilters } from "./search/DeckFilters"

export class DeckStore {

    static readonly DECK_PAGE_SIZE = 20
    static readonly CONTEXT = HttpConfig.API + "/decks"
    static readonly CONTEXT_SECURE = HttpConfig.API + "/decks/secured"

    @observable
    simpleDecks: Map<string, Deck> = new Map()

    @observable
    deckPage?: DeckPage

    @observable
    nextDeckPage?: DeckPage

    @observable
    decksCount?: DeckCount

    @observable
    currentFilters?: DeckFilters

    @observable
    searchingForDecks = false

    @observable
    countingDecks = false

    @observable
    addingMoreDecks = false

    @observable
    deck?: DeckWithSynergyInfo

    @observable
    saleInfo?: DeckSaleInfo[]

    @observable
    importedDeck?: boolean

    @observable
    importingDeck = false

    @observable
    importingAndAddingDeck = false

    @observable
    autoSearch = true

    @observable
    randomDeckId?: string

    @observable
    deckNameSearchResults: Deck[] = []

    deckNameSearchCancel: CancelTokenSource | undefined

    reset = () => {
        this.deckPage = undefined
        this.nextDeckPage = undefined
        this.decksCount = undefined
        this.currentFilters = undefined
    }

    findDeck = (keyforgeId: string) => {
        axios.get(`${DeckStore.CONTEXT}/with-synergies/${keyforgeId}`)
            .then((response: AxiosResponse) => {
                const deck: DeckWithSynergyInfo = response.data
                if (!deck || !deck.deck) {
                    messageStore.setWarningMessage(`You might need to import this deck. We couldn't find a deck with the id: ${keyforgeId}`)
                } else {
                    deck.deck.houses.sort()
                    this.deck = deck
                }
            })
    }

    findRandomDeckId = () => {
        axios.get(`${DeckStore.CONTEXT}/random`)
            .then((response: AxiosResponse<string>) => {
                log.debug(`Found random deck id: ${response.data}`)
                this.randomDeckId = response.data
            })
    }

    findDeckWithCards = (keyforgeId: string) => {
        if (this.simpleDecks.get(keyforgeId) == null) {
            axios.get(`${DeckStore.CONTEXT}/search-result-with-cards/${keyforgeId}`)
                .then((response: AxiosResponse) => {
                    const deck: Deck = response.data
                    deck.houses.sort()
                    this.simpleDecks.set(keyforgeId, deck)
                })
        }
    }

    refreshDeckScores = (keyforgeId: string) => {
        axios.post(`${DeckStore.CONTEXT_SECURE}/${keyforgeId}/refresh-deck-scores`)
            .then(() => {
                messageStore.setSuccessMessage("Scores refreshed! Reload the page to see them.")
            })
    }

    importDeck = (keyforgeId: string) => {
        this.importingDeck = true
        axios.post(`${DeckStore.CONTEXT}/${keyforgeId}/import`)
            .then((response: AxiosResponse) => {
                this.importedDeck = response.data
                if (!response.data) {
                    messageStore.setErrorMessage("Sorry, we couldn't find a deck with the given id")
                }

                this.importingDeck = false
                rightMenuStore.close()
                closeAllMenuStoresExcept()
            })
    }

    importDeckAndAddToMyDecks = (keyforgeId: string) => {
        this.importingAndAddingDeck = true
        axios.post(`${DeckStore.CONTEXT}/${keyforgeId}/import-and-add`)
            .then((response: AxiosResponse) => {
                this.importedDeck = response.data
                if (!response.data) {
                    messageStore.setErrorMessage("Sorry, we couldn't find a deck with the given id")
                } else {
                    userDeckStore.findAllForUser()
                }

                this.importingAndAddingDeck = false
                rightMenuStore.close()
                closeAllMenuStoresExcept()
            })
    }

    findDeckSaleInfo = (keyforgeId: string) => {
        axios.get(`${DeckStore.CONTEXT}/${keyforgeId}/sale-info`)
            .then((response: AxiosResponse) => {
                this.saleInfo = response.data
            })
    }

    findDecksByName = (name: string) => {
        if (this.deckNameSearchCancel != null) {
            this.deckNameSearchCancel.cancel()
        }
        this.deckNameSearchCancel = axios.CancelToken.source()
        axios.get(`${DeckStore.CONTEXT}/by-name/${name}`, {
            cancelToken: this.deckNameSearchCancel.token
        })
            .then((response: AxiosResponse<Deck[]>) => {
                // log.debug(`Find decks by name results: ${prettyJson(response.data)}`)
                this.deckNameSearchResults = response.data
                this.deckNameSearchCancel = undefined
            })
            .catch(error => {
                log.debug("Canceled request to find decks by name with message: " + error.message)
            })
    }

    refreshDeckSearch = () => {
        if (this.currentFilters) {
            return this.searchDecks(this.currentFilters)
        }
    }

    searchDecks = async (filters: DeckFilters) => {
        this.searchingForDecks = true
        filters.pageSize = keyLocalStorage.deckPageSize
        this.currentFilters = clone(filters)
        // log.debug(`Searching for first deck page with ${prettyJson(this.currentFilters)}`)
        this.nextDeckPage = undefined
        const decksPromise = this.findDecks(filters)
        const countPromise = this.findDecksCount(filters)
        const decks = await decksPromise
        if (decks) {
            // log.debug(`Replacing decks page with decks:  ${decks.decks.map((deck, idx) => `\n${idx + 1}. ${deck.name}`)}`)
            this.deckPage = decks
        }
        this.searchingForDecks = false
        await countPromise
        this.findNextDecks()
    }

    findNextDecks = async () => {
        if (this.currentFilters && this.moreDecksAvailable()) {
            this.addingMoreDecks = true
            this.currentFilters.page++
            // log.debug(`Searching for next deck page with ${prettyJson(this.currentFilters)}`)
            const decks = await this.findDecks(this.currentFilters)
            if (decks) {
                this.addingMoreDecks = false
                this.nextDeckPage = decks
            }
        }
    }

    showMoreDecks = () => {
        if (this.deckPage && this.nextDeckPage && this.decksCount) {
            // log.debug(`Current decks name: ${this.deckPage.decks.map((deck, idx) => `\n${idx + 1}. ${deck.name}`)}`)
            // log.debug(`Pushing decks name: ${this.nextDeckPage.decks.map((deck, idx) => `\n${idx + 1}. ${deck.name}`)}`)
            this.deckPage.decks.push(...this.nextDeckPage.decks)
            this.deckPage.page++
            this.nextDeckPage = undefined
            log.debug(`Current decks page ${this.deckPage.page}. Total pages ${this.decksCount.pages}.`)
            this.findNextDecks()
        }
    }

    moreDecksAvailable = () => (this.deckPage && this.decksCount && this.deckPage.page + 1 < this.decksCount.pages)
        || (this.deckPage && !this.decksCount && this.deckPage.decks.length % DeckStore.DECK_PAGE_SIZE === 0)

    private findDecks = async (filters: DeckFilters) => new Promise<DeckPage>(resolve => {
        axios.post(`${DeckStore.CONTEXT}/filter`, filters)
            .then((response: AxiosResponse) => {
                // log.debug(`With filters: ${prettyJson(filters)} Got the filtered decks. decks: ${prettyJson(response.data)}`)
                const decks: DeckPage = response.data
                decks.decks.forEach(deck => deck.houses.sort())
                resolve(decks)
            })
            .catch(() => {
                resolve()
            })
    })

    private findDecksCount = (filters: DeckFilters) => {
        this.decksCount = undefined
        this.countingDecks = true
        axios.post(`${DeckStore.CONTEXT}/filter-count`, filters)
            .then((response: AxiosResponse) => {
                this.countingDecks = false
                this.decksCount = response.data
            })
    }

}

export const deckStore = new DeckStore()
