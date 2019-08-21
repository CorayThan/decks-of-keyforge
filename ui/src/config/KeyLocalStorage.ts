import { observable } from "mobx"
import { log } from "./Utils"

enum Keys {
    AUTH = "AUTH",
    DECK_TABLE_VIEW = "DECK_TABLE_VIEW",
    FULL_CARD_VIEW = "FULL_CARD_VIEW",
    SHOW_ALL_CARDS = "SHOW_ALL_CARDS",
    DECK_PAGE_SIZE = "DECK_PAGE_SIZE",
    DISPLAY_EXTRA_DECK_STATS = "DISPLAY_EXTRA_DECK_STATS",
    DISPLAY_OLD_DECK_VIEW = "DISPLAY_OLD_DECK_VIEW",
    SMALL_TABLE_VIEW = "SMALL_TABLE_VIEW",
}

class KeyLocalStorage {

    @observable
    showTableView: boolean = false

    @observable
    showFullCardView: boolean = false

    @observable
    showAllCards: boolean = false

    @observable
    deckPageSize: number = 20

    @observable
    displayExtraDeckStats = false

    @observable
    displayOldDeckView = false

    @observable
    smallTableView = false

    private localStorage = window.localStorage

    constructor() {
        this.loadShowDeckTableView()
        this.loadShowFullCardView()
        this.loadDeckPageSize()
        this.loadDisplayExtraDeckStats()
        this.loadDisplayOldDeckView()
        this.loadSmallTableView()
        this.loadShowAllCards()
    }

    saveAuthKey = (token: string) => this.localStorage.setItem(Keys.AUTH, token)

    hasAuthKey = () => this.findAuthKey() != null

    findAuthKey = (): string | undefined => {
        const key = this.localStorage.getItem(Keys.AUTH)
        if (key === null) {
            log.debug("No auth key in local storage.")
            return undefined
        }
        log.debug("Found auth key in local storage.")
        return key
    }

    toggleDeckTableView = () => {
        this.showTableView = !this.showTableView
        this.localStorage.setItem(Keys.DECK_TABLE_VIEW, String(this.showTableView))
    }

    toggleFullCardView = () => {
        this.showFullCardView = !this.showFullCardView
        this.localStorage.setItem(Keys.FULL_CARD_VIEW, String(this.showFullCardView))
    }

    toggleShowAllCards = () => {
        this.showAllCards = !this.showAllCards
        this.localStorage.setItem(Keys.SHOW_ALL_CARDS, String(this.showAllCards))
    }

    toggleDisplayExtraDeckStats = () => {
        this.displayExtraDeckStats = !this.displayExtraDeckStats
        this.localStorage.setItem(Keys.DISPLAY_EXTRA_DECK_STATS, this.displayExtraDeckStats.toString())
    }

    toggleDisplayOldDeckView = () => {
        this.displayOldDeckView = !this.displayOldDeckView
        this.localStorage.setItem(Keys.DISPLAY_OLD_DECK_VIEW, this.displayOldDeckView.toString())
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

    clear = () => {
        log.debug("Clearing local storage.")
        this.localStorage.clear()
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

    private loadDisplayOldDeckView = () => {
        this.displayOldDeckView = this.localStorage.getItem(Keys.DISPLAY_OLD_DECK_VIEW) === "true"
    }

    private loadShowFullCardView = () => {
        this.showFullCardView = this.localStorage.getItem(Keys.FULL_CARD_VIEW) === "true"
    }

    private loadShowAllCards = () => {
        this.showAllCards = this.localStorage.getItem(Keys.SHOW_ALL_CARDS) === "true"
    }

    private loadShowDeckTableView = () => {
        this.showTableView = this.localStorage.getItem(Keys.DECK_TABLE_VIEW) === "true"
    }

    private loadDisplayExtraDeckStats = () => {
        this.displayExtraDeckStats = this.localStorage.getItem(Keys.DISPLAY_EXTRA_DECK_STATS) === "true"
    }

}

export const keyLocalStorage = new KeyLocalStorage()
