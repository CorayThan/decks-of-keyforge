import { observable } from "mobx"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing } from "../config/MuiConfig"

export enum ScreenSize {
    xs,
    sm,
    md,
    lg
}

export class ScreenStore {

    @observable
    private screenSize: ScreenSize = ScreenSize.md

    @observable
    screenWidth: number

    @observable
    screenHeight: number

    zindexes = {
        cardSearchSuggest: 1,
        keyDrawer: 1000,
        keyTopBar: 9000,
        topBarRegistration: 10000,
        rightMenu: 11000,
        menuPops: 12000,
        modals: 12500,
        cardsDisplay: 13000,
        tooltip: 14000
    }

    constructor() {
        this.screenWidth = window.innerWidth
        this.screenHeight = window.innerHeight
        this.onResize()
        window.addEventListener("resize", this.onResize)
    }

    smallDeckView = () => screenStore.screenWidth < 768

    smallScreenDeckWidth = 328
    wideScreenDeckHeight = 612

    displayDeckSaleInfoSeparately = () => this.screenWidth < 1080

    deckWidth = (forSale: boolean) => {
        if (this.smallDeckView()) {
            return this.smallScreenDeckWidth
        } else if (forSale && !this.displayDeckSaleInfoSeparately()) {
            return 1032
        } else {
            return 704
        }
    }

    deckHeight = () => {
        let height
        if (this.smallDeckView()) {
            height = 948
        } else {
            height = this.wideScreenDeckHeight
        }
        if (keyLocalStorage.genericStorage.viewNotes) {
            height += 94 + spacing(2)
        }
        return height
    }

    screenSizeXs = () => this.screenSize === ScreenSize.xs
    screenSizeSm = () => this.screenSize <= ScreenSize.sm
    screenSizeMd = () => this.screenSize <= ScreenSize.md
    screenSizeLg = () => this.screenSize <= ScreenSize.lg

    smallScreenTopBar = () => this.screenWidth < 1680

    screenSizeMdPlus = () => this.screenSize >= ScreenSize.md

    topbarNameShortened = (name: string, shortName: string) => {
        let shortened = name
        if (this.screenWidth < 1250) {
            shortened = shortName
        }
        return shortened
    }

    private onResize = () => {
        this.screenWidth = window.innerWidth
        if (this.screenWidth < 704) {
            this.screenSize = ScreenSize.xs
        } else if (this.screenWidth < 960) {
            this.screenSize = ScreenSize.sm
        } else if (this.screenWidth < 1280) {
            this.screenSize = ScreenSize.md
        } else {
            this.screenSize = ScreenSize.lg
        }
    }
}

export const screenStore = new ScreenStore()
