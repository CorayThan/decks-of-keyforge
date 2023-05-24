import {makeObservable, observable} from "mobx"
import {DeckNameId} from "../decks/comparison/CompareDecks"
import {ListingInfo} from "../generated-src/ListingInfo"
import {log} from "./Utils"
import {House} from "../generated-src/House";
import { Expansion } from "../generated-src/Expansion";
import { AllianceDeckNameId } from "../alliancedecks/AllianceDeckPopover";

enum Keys {
    AUTH = "AUTH",
    CARD_LIST_VIEW_TYPE = "CARD_LIST_VIEW_TYPE",
    SHOW_ALL_CARDS = "SHOW_ALL_CARDS",
    DECK_PAGE_SIZE = "DECK_PAGE_SIZE",
    DISPLAY_EXTRA_DECK_STATS = "DISPLAY_EXTRA_DECK_STATS",
    SMALL_TABLE_VIEW = "SMALL_TABLE_VIEW",
    DECK_LIST_VIEW_TYPE = "DECK_LIST_VIEW_TYPE",
    SALE_DEFAULTS = "SALE_DEFAULTS_2",
    DECKS_TO_COMPARE = "DECKS_TO_COMPARE",
    ALLIANCE_DECKS = "ALLIANCE_DECKS",
    GENERIC_STORAGE = "GENERIC_STORAGE"
}

type CardViewType = "image" | "full" | "table"
type DeckViewType = "graphs" | "grid" | "table"

interface GenericStorage {
    showMoreDeckSearchOptions?: boolean
    userRows?: number
    viewNotes?: boolean
    viewTags?: boolean

    offersSent?: boolean
    offersAccepted?: boolean
    offersRejected?: boolean
    offersCanceled?: boolean
    includeExpiredOffers?: boolean
    analyzeCount?: number
    buildAllianceDeck?: boolean
    addAllianceToMyAlliances?: boolean
}

class KeyLocalStorage {

    @observable
    genericStorage: GenericStorage = {}

    @observable
    deckListViewType: DeckViewType = "grid"

    @observable
    cardListViewType: CardViewType = "full"

    @observable
    showAllCards = false

    @observable
    deckPageSize = 20

    @observable
    displayExtraDeckStats = false

    @observable
    smallTableView = false

    @observable
    saleDefaults?: Partial<ListingInfo>

    @observable
    decksToCompare: DeckNameId[] = []

    @observable
    allianceDeckHouses: AllianceDeckNameId[] = []

    private localStorage = window.localStorage

    constructor() {
        makeObservable(this)
        this.loadDeckListViewType()
        this.loadDeckPageSize()
        this.loadDisplayExtraDeckStats()
        this.loadSmallTableView()
        this.loadShowAllCards()
        this.loadCardListViewType()
        this.loadSaleDefaults()
        this.loadDecksToCompare()
        this.loadAllianceDecks()
        this.loadGenericStorage()
    }

    userRows = () => {
        const rows: number | undefined = this.genericStorage.userRows
        if (rows == null) {
            return 10
        }
        return rows
    }

    saveAuthKey = (token: string) => this.localStorage.setItem(Keys.AUTH, token)

    hasAuthKey = () => this.findAuthKey() != null

    findAuthKey = (): string | undefined => {
        const key = this.localStorage.getItem(Keys.AUTH)
        if (key === null) {
            log.debug("No auth key in local storage.")
            return undefined
        }
        return key
    }

    setDeckListViewType = (type: DeckViewType) => {
        this.deckListViewType = type
        this.localStorage.setItem(Keys.DECK_LIST_VIEW_TYPE, type)
    }

    setCardListViewType = (type: CardViewType) => {
        this.cardListViewType = type
        this.localStorage.setItem(Keys.CARD_LIST_VIEW_TYPE, type)
    }

    toggleShowAllCards = () => {
        this.showAllCards = !this.showAllCards
        this.localStorage.setItem(Keys.SHOW_ALL_CARDS, String(this.showAllCards))
    }

    toggleDisplayExtraDeckStats = () => {
        this.displayExtraDeckStats = !this.displayExtraDeckStats
        this.localStorage.setItem(Keys.DISPLAY_EXTRA_DECK_STATS, this.displayExtraDeckStats.toString())
    }

    toggleSmallTableView = () => {
        this.smallTableView = !this.smallTableView
        this.localStorage.setItem(Keys.SMALL_TABLE_VIEW, this.smallTableView.toString())
    }

    setDeckPageSize = (size: number) => {
        if (size < 1) {
            return
        }
        this.deckPageSize = size
        this.localStorage.setItem(Keys.DECK_PAGE_SIZE, size.toString())
    }

    setSaleDefaults = (defaults: Partial<ListingInfo>) => {
        this.saleDefaults = defaults
        this.localStorage.setItem(Keys.SALE_DEFAULTS, JSON.stringify(defaults))
    }

    removeDeckToCompare = (id: string) => {
        if (this.decksToCompare.find(existingDeck => existingDeck.keyforgeId === id) != null) {
            this.decksToCompare = this.decksToCompare.filter(deck => deck.keyforgeId !== id)
            this.localStorage.setItem(Keys.DECKS_TO_COMPARE, JSON.stringify(this.decksToCompare))
        }
    }

    addDeckToCompare = (deck: DeckNameId) => {
        if (this.decksToCompare.find(existingDeck => existingDeck.keyforgeId === deck.keyforgeId) == null) {
            this.decksToCompare.push(deck)
            this.localStorage.setItem(Keys.DECKS_TO_COMPARE, JSON.stringify(this.decksToCompare))
        }
    }

    clearDeckstoCompare = () => {
        this.localStorage.removeItem(Keys.DECKS_TO_COMPARE)
        this.decksToCompare = []
    }

    clearAllianceDeck = () => {
        this.allianceDeckHouses = []
        this.localStorage.removeItem(Keys.ALLIANCE_DECKS)
    }

    removeAllianceHouse = (id: string) => {
        if (this.allianceDeckHouses.find(existingDeck => existingDeck.deckId === id) != null) {
            this.allianceDeckHouses = this.allianceDeckHouses.filter(deck => deck.deckId !== id)
            this.localStorage.setItem(Keys.ALLIANCE_DECKS, JSON.stringify(this.allianceDeckHouses))
        }
    }

    addAllianceHouse = (deckId: string, deckName: string, house: House, expansion: Expansion) => {
        const allianceDeckNameId: AllianceDeckNameId = {deckId, deckName, house, expansion}
        this.allianceDeckHouses.push(allianceDeckNameId)
        this.localStorage.setItem(Keys.ALLIANCE_DECKS, JSON.stringify(this.allianceDeckHouses))
    }

    updateGenericStorage = (updates: GenericStorage) => {
        const updated = {
            ...this.genericStorage,
            ...updates
        }
        this.genericStorage = updated
        const asJson = JSON.stringify(updated)
        this.localStorage.setItem(Keys.GENERIC_STORAGE, asJson)
    }

    findAnalyzeCount = () => {
        const fromGeneric = this.genericStorage.analyzeCount
        if (fromGeneric == null) {
            return 500
        } else {
            return fromGeneric
        }
    }

    toggleViewNotes = () => {
        keyLocalStorage.updateGenericStorage({viewNotes: !keyLocalStorage.genericStorage.viewNotes})
    }

    toggleViewTags = () => {
        keyLocalStorage.updateGenericStorage({viewTags: !keyLocalStorage.genericStorage.viewTags})
    }

    clear = () => {
        log.debug("Clearing auth related local storage")
        this.localStorage.removeItem(Keys.AUTH)
    }

    private loadSaleDefaults = () => {
        const saleDefaults = this.localStorage.getItem(Keys.SALE_DEFAULTS)
        if (saleDefaults != null && saleDefaults.length > 0) {
            try {
                this.saleDefaults = JSON.parse(saleDefaults) as Partial<ListingInfo>
            } catch (e) {
                log.error("Couldn't read sale defaults from " + saleDefaults)
                this.localStorage.removeItem(Keys.SALE_DEFAULTS)
            }
        }
    }

    private loadDecksToCompare = () => {
        const decksToCompare = this.localStorage.getItem(Keys.DECKS_TO_COMPARE)
        if (decksToCompare != null && decksToCompare.length > 0) {
            try {
                this.decksToCompare = JSON.parse(decksToCompare) as DeckNameId[]
            } catch (e) {
                log.error("Couldn't read decks to compare from " + decksToCompare)
                this.localStorage.removeItem(Keys.DECKS_TO_COMPARE)
            }
        }
    }

    private loadAllianceDecks = () => {
        const allianceDecks = this.localStorage.getItem(Keys.ALLIANCE_DECKS)
        if (allianceDecks != null && allianceDecks.length > 0) {
            try {
                this.allianceDeckHouses = JSON.parse(allianceDecks) as AllianceDeckNameId[]
            } catch (e) {
                log.error("Couldn't read alliances " + allianceDecks)
                this.localStorage.removeItem(Keys.ALLIANCE_DECKS)
            }
        }
    }

    private loadDeckListViewType = () => {
        const deckListViewType = this.localStorage.getItem(Keys.DECK_LIST_VIEW_TYPE)
        if (deckListViewType != null && deckListViewType.trim().length > 0) {
            this.deckListViewType = deckListViewType as DeckViewType
        }
    }

    private loadCardListViewType = () => {
        const cardListViewType = this.localStorage.getItem(Keys.CARD_LIST_VIEW_TYPE)
        if (cardListViewType != null && cardListViewType.trim().length > 0) {
            this.cardListViewType = cardListViewType as CardViewType
        }
    }

    private loadDeckPageSize = () => {
        const deckPageSizeString = this.localStorage.getItem(Keys.DECK_PAGE_SIZE)
        const deckPageSize = Number(deckPageSizeString)
        if (deckPageSize > 0) {
            this.deckPageSize = deckPageSize
        }
    }

    private loadSmallTableView = () => {
        this.smallTableView = this.localStorage.getItem(Keys.SMALL_TABLE_VIEW) === "true"
    }

    private loadShowAllCards = () => {
        this.showAllCards = this.localStorage.getItem(Keys.SHOW_ALL_CARDS) === "true"
    }

    private loadDisplayExtraDeckStats = () => {
        this.displayExtraDeckStats = this.localStorage.getItem(Keys.DISPLAY_EXTRA_DECK_STATS) === "true"
    }

    private loadGenericStorage = () => {
        const foundGeneric = this.localStorage.getItem(Keys.GENERIC_STORAGE)
        if (foundGeneric == null) {
            this.genericStorage = {}
        } else {
            this.genericStorage = JSON.parse(foundGeneric)
        }
    }

}

export const keyLocalStorage = new KeyLocalStorage()
