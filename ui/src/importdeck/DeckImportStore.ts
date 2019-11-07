import axios from "axios"
import { sample } from "lodash"
import { observable } from "mobx"
import { cardStore } from "../cards/CardStore"
import { axiosWithoutErrors, HttpConfig } from "../config/HttpConfig"
import { log, prettyJson } from "../config/Utils"
import { BackendExpansion } from "../expansions/Expansions"
import { messageStore } from "../ui/MessageStore"
import { SaveUnregisteredDeck } from "./SaveUnregisteredDeck"

class DeckImportStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/decks/secured"

    @observable
    readingDeckImage = false

    @observable
    readingDeckMessage = ""

    messageIntervalId = 0

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
            if (responseData.message.includes("Duplicate deck name")) {
                messageStore.setWarningMessage("There is already a deck with this name.")
            } else {
                messageStore.setRequestErrorMessage()
            }
        }
        this.addingNewDeck = false
    }

    startMessages = () => {
        this.readingDeckMessage = sample(cardStore.cardFlavors)!
        this.messageIntervalId = window.setInterval(() => {
            this.readingDeckMessage = sample(cardStore.cardFlavors)!
        }, 8000)
    }

    stopMessages = () => window.clearInterval(this.messageIntervalId)

    readImageIntoDeck = async (deckImage: File, expansion: BackendExpansion) => {
        this.readingDeckImage = true

        const imageData = new FormData()
        imageData.append("deckImage", deckImage)

        const response = await axios.post(
            `${DeckImportStore.SECURE_CONTEXT}/read-deck-image/${expansion}`,
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
            messageStore.setWarningMessage("Please try a higher quality image.")
        }

        // log.debug(`Found deck: ${prettyJson(this.readDeck)}`)
        this.readingDeckImage = false
    }
}

export const deckImportStore = new DeckImportStore()
