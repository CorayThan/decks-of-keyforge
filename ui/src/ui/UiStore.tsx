import { observable } from "mobx"

export class UiStore {
    private static innerInstance: UiStore

    @observable
    topbarName = ""

    @observable
    topbarShortName = ""

    @observable
    topbarSubheader?: string

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    setTopbarValues = (name: string, shortName: string, subheader: string) => {
        document.title = name + (name === "Decks of Keyforge" || name === "Cards of Keyforge" ? "" : " – Decks of Keyforge")
        const description = document.getElementsByTagName("meta").namedItem("description")
        if (description) {
            description.content =
                (name.length > 0 ? (name + " – ") : "") +
                "Search, evaluate, buy and sell Keyforge decks. Find synergies and antisynergies for your decks with the SAS rating system."
        }

        this.topbarName = name
        this.topbarShortName = shortName
        this.topbarSubheader = subheader
    }
}
