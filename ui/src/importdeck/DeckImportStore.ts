import axios from "axios"
import { sample } from "lodash"
import { observable } from "mobx"
import { CardStore } from "../cards/CardStore"
import { axiosWithoutErrors, HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { MessageStore } from "../ui/MessageStore"
import { SaveUnregisteredDeck } from "./SaveUnregisteredDeck"

class DeckImportStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/decks/secured"

    @observable
    readingDeckImage = false

    @observable
    readingDeckMessage = ""

    messageIntervalId: number = 0

    @observable
    readDeck?: SaveUnregisteredDeck

    @observable
    newDeckId?: string

    @observable
    addingNewDeck = false

    addUnregisteredDeck = async (deck: SaveUnregisteredDeck) => {
        try {
            this.addingNewDeck = true
            const response = await axiosWithoutErrors.post(DeckImportStore.SECURE_CONTEXT + "/add-unregistered", deck)
            this.newDeckId = response.data
        } catch (error) {
            const responseData = error.response.data
            log.debug(`Axios error: ${prettyJson(responseData)}`)
            if (responseData.message === "Duplicate deck name.") {
                MessageStore.instance.setWarningMessage("There is already a deck with this name.")
            }
        }
        this.addingNewDeck = false
    }

    readImageIntoDeck = async (deckImage: File) => {
        this.readingDeckImage = true

        this.readingDeckMessage = sample(CardStore.instance.cardFlavors)!
        this.messageIntervalId = window.setInterval(() => {
            this.readingDeckMessage = sample(CardStore.instance.cardFlavors)!
        }, 5000)

        const imageData = new FormData()
        imageData.append("deckImage", deckImage)

        const response = await axios.post(
            DeckImportStore.SECURE_CONTEXT + "/read-deck-image",
            imageData,
            {
                headers: {
                    "content-type": "multipart/form-data"
                }
            }
        )
        this.readDeck = response.data

        if (!this.readDeck) {
            this.readDeck = undefined
            MessageStore.instance.setWarningMessage("Please try a higher quality image.")
        }

        log.debug(`Found deck: ${prettyJson(this.readDeck)}`)

        this.readingDeckImage = false
    }
}

export const deckImportStore = new DeckImportStore()
