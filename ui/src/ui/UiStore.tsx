import { observable } from "mobx"

export class UiStore {

    @observable
    topbarName = ""

    @observable
    topbarShortName = ""

    @observable
    topbarSubheader?: string

    setTopbarValues = (name: string, shortName: string, subheader: string) => {

        this.setDocTitleAndDescription(name)

        const maxTopBarLength = 25

        this.topbarName = name.length <= maxTopBarLength ? name : name.slice(0, maxTopBarLength).trim() + "..."
        this.topbarShortName = shortName
        this.topbarSubheader = subheader
    }

    setDocTitleAndDescription = (name: string) => {
        document.title = name + (name === "Decks of KeyForge" || name === "Cards of KeyForge" ? "" : " – Decks of KeyForge")
        const description = document.getElementsByTagName("meta").namedItem("description")
        if (description) {
            description.content =
                (name.length > 0 ? (name + " – ") : "") +
                "Search, evaluate, buy and sell KeyForge decks. Find synergies and antisynergies for your decks with the SAS rating system."
        }
    }
}

export const uiStore = new UiStore()
