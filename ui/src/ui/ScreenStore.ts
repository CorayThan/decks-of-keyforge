import { observable } from "mobx"

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
        cardsDisplay: 13000,
    }

    constructor() {
        this.screenWidth = window.innerWidth
        this.screenHeight = window.innerHeight
        this.onResize()
        window.addEventListener("resize", this.onResize)
    }

    smallDeckView = () => screenStore.screenWidth < 768
    screenSizeXs = () => this.screenSize === ScreenSize.xs
    screenSizeSm = () => this.screenSize <= ScreenSize.sm
    screenSizeMd = () => this.screenSize <= ScreenSize.md
    screenSizeLg = () => this.screenSize <= ScreenSize.lg

    smallScreenTopBar = () => this.screenWidth < 1680

    screenSizeMdPlus = () => this.screenSize >= ScreenSize.md

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
