import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios"
import { clone } from "lodash"
import { computed, makeObservable, observable } from "mobx"
import { axiosWithoutErrors, HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { CollectionStats } from "../generated-src/CollectionStats"
import { DeckSaleInfo } from "../generated-src/DeckSaleInfo"
import { PastSas } from "../generated-src/PastSas"
import { messageStore } from "../ui/MessageStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { DeckCompareResults } from "./comparison/CompareDecks"
import { DeckCount, DeckPage, DeckSearchResult, DeckWithSynergyInfo } from "./models/DeckSearchResult"
import { DeckFilters } from "./search/DeckFilters"
import { DeckStoreInterface } from "../alliancedecks/DeckStoreInterface"
import { DecksToCompareDto } from "../generated-src/DecksToCompareDto"
import { BadRequestException } from "../config/Exceptions"

export class DeckStore implements DeckStoreInterface {
    static readonly DECK_PAGE_SIZE = 20
    static readonly CONTEXT = HttpConfig.API + "/decks"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/decks/secured"
    private static readonly MAX_PAGE_SIZE = 500

    @observable
    simpleDecks: Map<string, DeckSearchResult> = new Map()

    @observable
    currentDeckPage = 0

    @observable
    importDecksPageDeck?: DeckSearchResult

    @observable
    decksToDisplay?: number[]

    deckIdToDeck?: Map<number, DeckSearchResult>

    deckPage?: DeckPage
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
    randomDeckId?: string

    @observable
    pastSas?: PastSas[]

    @observable
    deckNameSearchResults: DeckSearchResult[] = []

    @observable
    decksToDownload?: DeckSearchResult[]

    @observable
    downloadingDecks = false

    deckNameSearchCancel: CancelTokenSource | undefined

    @observable
    collectionStats?: CollectionStats

    @observable
    calculatingStats = false

    @observable
    compareDecks?: DeckCompareResults[]

    reset = () => {
        this.currentDeckPage = 0
        this.deckIdToDeck = undefined
        this.deckPage = undefined
        this.nextDeckPage = undefined
        this.decksCount = undefined
        this.currentFilters = undefined
    }

    findComparisonDecks = async (deckIds: string[], allianceDeckIds: string[]) => {
        this.compareDecks = undefined
        const toSend: DecksToCompareDto = {
            deckIds,
            allianceDeckIds
        }
        const response: AxiosResponse<DeckCompareResults[]> = await axios.post(`${DeckStore.CONTEXT}/compare`, toSend)
        this.compareDecks = response.data
    }

    findDeckForImportPage = async (keyforgeId: string) => {
        const response: AxiosResponse<DeckWithSynergyInfo> = await axios.get(`${DeckStore.CONTEXT}/with-synergies/${keyforgeId}`)

        const deck: DeckWithSynergyInfo = response.data
        if (!deck || !deck.deck) {
            messageStore.setWarningMessage(`Couldn't fetch the deck with id: ${keyforgeId}`)
        } else {
            this.importDecksPageDeck = deck.deck
        }
        return deck
    }

    findDeck = async (keyforgeId: string) => {
        const response: AxiosResponse<DeckWithSynergyInfo> = await axios.get(`${DeckStore.CONTEXT}/with-synergies/${keyforgeId}`)

        const deck: DeckWithSynergyInfo = response.data
        if (!deck || !deck.deck) {
            messageStore.setWarningMessage(`You might need to import this deck. We couldn't find a deck with the id: ${keyforgeId}`)
        } else {
            this.deck = deck
        }

        return deck
    }

    findPastSas = (deckId: number) => {
        this.pastSas = undefined
        axios.get(`${DeckStore.CONTEXT}/past-sas/${deckId}`)
            .then((response: AxiosResponse<PastSas[]>) => {
                this.pastSas = response.data
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
                    const deck: DeckSearchResult = response.data
                    this.simpleDecks.set(keyforgeId, deck)
                })
        }
    }

    refreshDeckScores = (keyforgeId: string) => {
        axios.post(`${DeckStore.SECURE_CONTEXT}/${keyforgeId}/refresh-deck-scores`)
            .then(() => {
                messageStore.setSuccessMessage("Deck refreshed! Reload the page to any changes.")
            })
    }

    importDeck = async (keyforgeId: string) => {
        try {
            const deckImportResponse: AxiosResponse<boolean> = await axiosWithoutErrors.post(`${DeckStore.CONTEXT}/${keyforgeId}/import`)
            this.importedDeck = deckImportResponse.data
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const errorMessage = (e as AxiosError<BadRequestException>).response?.data?.message
                if (errorMessage != null) {
                    return errorMessage
                }
            }
            return "Unexpected error importing deck."
        }
    }

    importDeckAndAddToMyDecks = async (keyforgeId: string) => {
        try {
            const deckImportResponse: AxiosResponse<boolean> = await axiosWithoutErrors.post(`${DeckStore.CONTEXT}/${keyforgeId}/import-and-add`)
            this.importedDeck = deckImportResponse.data
            if (deckImportResponse.data) {
                await userDeckStore.findOwnedDecks()
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                const errorMessage = (e as AxiosError<BadRequestException>).response?.data?.message
                if (errorMessage != null) {
                    return errorMessage
                }
            }
            return "Unexpected error importing deck."
        }
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
            .then((response: AxiosResponse<DeckSearchResult[]>) => {
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

    refreshDeckInfo = () => {
        if (this.deck) {
            const keyforgeId = this.deck.deck.keyforgeId
            this.findDeck(keyforgeId)
            this.findDeckSaleInfo(keyforgeId)
        }
    }

    calculateCollectionStats = async (filters: DeckFilters) => {
        this.calculatingStats = true
        this.collectionStats = undefined
        const modFilters = {...filters}
        modFilters.page = 0
        modFilters.pageSize = keyLocalStorage.findAnalyzeCount()
        const statResults: AxiosResponse<CollectionStats> = await axios.post(`${DeckStore.CONTEXT}/stats`, modFilters)
        this.collectionStats = statResults.data
        this.calculatingStats = false
    }

    searchDecks = async (filters: DeckFilters) => {
        this.searchingForDecks = true
        filters.pageSize = keyLocalStorage.deckPageSize
        this.currentFilters = clone(filters)
        // log.debug(`Searching for first deck page with ${prettyJson(this.currentFilters)}`)
        this.nextDeckPage = undefined
        const decksPromise = this.findDecks(filters)
        this.findDecksCount(filters)
        const decks = await decksPromise
        if (decks) {
            // log.debug(`Replacing decks page with decks:  ${decks.decks.map((deck, idx) => `\n${idx + 1}. ${deck.name}`)}`)
            this.decksToDisplay = undefined
            this.deckIdToDeck = undefined
            this.addNewDecksToDecks(decks)
        }
        this.searchingForDecks = false
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

    showMoreDecks = async () => {
        if (this.deckPage && this.nextDeckPage && this.decksCount) {
            // log.debug(`Current decks page ${this.deckPage.page}. Total pages ${this.decksCount.pages}.`)
            this.addNewDecksToDecks(this.nextDeckPage)
            this.nextDeckPage = undefined
            this.findNextDecks()
            // log.debug(`Done finding decks. Current decks page ${this.deckPage.page}. Total pages ${this.decksCount.pages}.`)
        }
    }

    displayDecks = () => {
        if (this.decksToDisplay == null) {
            return undefined
        }
        return this.decksToDisplay
            .map(deckId => this.deckIdToDeck?.get(deckId))
            .filter(deck => deck != null) as DeckSearchResult[]
    }

    moreDecksAvailable = () => (this.deckPage && this.decksCount && this.deckPage.page + 1 < this.decksCount.pages)
        || (this.deckPage && !this.decksCount && this.deckPage.decks.length % DeckStore.DECK_PAGE_SIZE === 0)

    findDecksToDownload = async (filters: DeckFilters, num: number) => {
        this.downloadingDecks = true
        this.decksToDownload = undefined
        const copiedFilters = {...filters}
        copiedFilters.pageSize = num
        copiedFilters.page = 0
        let decksBeingDownloaded: DeckSearchResult[] = []
        copiedFilters.pageSize = DeckStore.MAX_PAGE_SIZE
        let leftToDownload = num
        while (leftToDownload > 0) {
            const deckResults: AxiosResponse<DeckPage> = await axios.post(`${DeckStore.CONTEXT}/filter`, copiedFilters)
            decksBeingDownloaded = decksBeingDownloaded.concat(deckResults.data.decks)
            log.info(`Downloaded ${decksBeingDownloaded.length} decks so far current page: ${copiedFilters.page}`)
            copiedFilters.page++
            leftToDownload -= DeckStore.MAX_PAGE_SIZE
        }
        this.decksToDownload = decksBeingDownloaded
        this.downloadingDecks = false
    }

    constructor() {
        makeObservable(this)
    }

    @computed
    get searchingOrLoaded(): boolean {
        return this.searchingForDecks || this.decksToDisplay != null
    }

    private addNewDecksToDecks = (decks: DeckPage) => {
        this.deckPage = decks
        if (this.deckIdToDeck == null) {
            this.deckIdToDeck = new Map()
        }
        decks.decks.forEach(deck => {
            this.deckIdToDeck!.set(deck.id, deck)
        })
        const decksToAdd = decks.decks.map(deck => deck.id)
        if (this.decksToDisplay == null) {
            this.decksToDisplay = []
        }
        this.decksToDisplay = this.decksToDisplay.concat(decksToAdd)
        this.currentDeckPage = decks.page
    }

    private findDecks = async (filters: DeckFilters) => {
        const response: AxiosResponse<DeckPage> = await axios.post(`${DeckStore.CONTEXT}/filter`, filters)
        return response.data
    }

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
