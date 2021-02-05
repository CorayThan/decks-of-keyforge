import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { DeckOwnershipDto } from "./DeckOwnershipDto"

export class DeckOwnershipStore {
    static readonly CONTEXT = HttpConfig.API + "/deck-ownership"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/deck-ownership/secured"

    @observable
    ownedDecks: number[] = []

    @observable
    verificationDetails?: DeckOwnershipDto[]

    @observable
    addingDeckVerificationImage = false

    saveDeckVerificationImage = async (deckImage: File | Blob, deckId: number, extension: string) => {
        this.addingDeckVerificationImage = true

        const imageData = new FormData()
        imageData.append("deckImage", deckImage)

        await axios.post(
            `${DeckOwnershipStore.SECURE_CONTEXT}/${deckId}`,
            imageData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Extension": extension
                }
            }
        )

        this.ownedDecks.push(deckId)
        await this.findDetailsForDeck(deckId)

        this.addingDeckVerificationImage = false
    }

    findDetailsForDeck = async (id: number) => {
        const spoiler: AxiosResponse<DeckOwnershipDto[]> = await axios.get(`${DeckOwnershipStore.CONTEXT}/${id}`)
        this.verificationDetails = spoiler.data
    }

    findOwnedDecks = async () => {
        if (keyLocalStorage.hasAuthKey()) {
            const spoiler: AxiosResponse<number[]> = await axios.get(`${DeckOwnershipStore.SECURE_CONTEXT}/for-me`)
            this.ownedDecks = spoiler.data
        }
    }

    deleteOwnership = async (deckId: number) => {
        this.addingDeckVerificationImage = true
        await axios.delete(`${DeckOwnershipStore.SECURE_CONTEXT}/${deckId}`)
        await this.findDetailsForDeck(deckId)
        this.findOwnedDecks()
        this.addingDeckVerificationImage = false
    }

    constructor() {
        makeObservable(this)
    }
}

export const deckOwnershipStore = new DeckOwnershipStore()
