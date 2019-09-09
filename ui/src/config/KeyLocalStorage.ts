import { observable } from "mobx"
import { screenStore } from "../ui/ScreenStore"
import { log } from "./Utils"

enum Keys {
    AUTH = "AUTH",
    DECK_TABLE_VIEW = "DECK_TABLE_VIEW",
    FULL_CARD_VIEW = "FULL_CARD_VIEW",
    SHOW_ALL_CARDS = "SHOW_ALL_CARDS",
    DECK_PAGE_SIZE = "DECK_PAGE_SIZE",
    DISPLAY_EXTRA_DECK_STATS = "DISPLAY_EXTRA_DECK_STATS",
    SMALL_TABLE_VIEW = "SMALL_TABLE_VIEW",
    DECK_LIST_VIEW_TYPE = "DECK_LIST_VIEW_TYPE",
}

class KeyLocalStorage {

    @observable
    deckListViewType: "graphs" | "grid" | "table" = screenStore.screenSizeMd() ? "grid" : "graphs"

    @observable
    showFullCardView: boolean = false

    @observable
    showAllCards: boolean = false

    @observable
    deckPageSize: number = 20

    @observable
    displayExtraDeckStats = false

    @observable
    smallTableView = false

    private localStorage = window.localStorage

    constructor() {
        this.loadDeckListViewType()
        this.loadShowFullCardView()
        this.loadDeckPageSize()
        this.loadDisplayExtraDeckStats()
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

    setDeckListViewType = (type: "graphs" | "grid" | "table") => {
        this.deckListViewType = type
        this.localStorage.setItem(Keys.DECK_LIST_VIEW_TYPE, type)
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

    private loadDeckListViewType = () => {
        const deckListViewType = this.localStorage.getItem(Keys.DECK_LIST_VIEW_TYPE)
        if (deckListViewType != null && deckListViewType.trim().length > 0) {
            this.deckListViewType = deckListViewType as "graphs" | "grid" | "table"
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

    private loadShowFullCardView = () => {
        this.showFullCardView = this.localStorage.getItem(Keys.FULL_CARD_VIEW) === "true"
    }

    private loadShowAllCards = () => {
        this.showAllCards = this.localStorage.getItem(Keys.SHOW_ALL_CARDS) === "true"
    }

    private loadDisplayExtraDeckStats = () => {
        this.displayExtraDeckStats = this.localStorage.getItem(Keys.DISPLAY_EXTRA_DECK_STATS) === "true"
    }

}

export const keyLocalStorage = new KeyLocalStorage()
