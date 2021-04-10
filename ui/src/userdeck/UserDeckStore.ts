import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { deckStore } from "../decks/DeckStore"
import { DeckNotesDto } from "../generated-src/DeckNotesDto"
import { messageStore } from "../ui/MessageStore"

export class UserDeckStore {
    static readonly CONTEXT = HttpConfig.API + "/userdeck/secured"

    @observable
    ownedDecks?: number[]

    @observable
    deckNotes?: Map<number, DeckNotesDto>

    @observable
    favDecks?: number[]

    @observable
    funnyDecks?: number[]

    @observable
    loadingOwned = false

    @observable
    loadingNotes = false

    @observable
    loadingFavs = false

    @observable
    loadingFunnies = false

    favorite = (deckName: string, deckId: number, wishlist: boolean) => {
        this.loadingFavs = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${wishlist ? "" : "un"}wishlist`)
            .then(() => {
                messageStore.setSuccessMessage(wishlist ? `Added ${deckName} to your favorites!` : `Removed ${deckName} from your favorites.`)
                this.findFavsForUser()
            })
    }

    funny = (deckName: string, deckId: number, funny: boolean) => {
        this.loadingFunnies = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${funny ? "" : "un"}funny`)
            .then(() => {
                messageStore.setSuccessMessage(funny ? `Marked ${deckName} as funny!` : `Unmarked ${deckName} as funny.`)
                this.findFunniesForUser()
            })
    }

    owned = (deckName: string, deckId: number, owned: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${owned ? "" : "un"}owned`)
            .then(() => {
                messageStore.setSuccessMessage(owned ? `Added ${deckName} to your decks.` : `Removed ${deckName} from your decks.`)
                this.findOwned()
            })
    }

    notPreviouslyOwned = (deckName: string, deckId: number) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/not-previously-owned`)
            .then(() => {
                messageStore.setSuccessMessage(`Removed ${deckName} from your previously owned decks.`)
            })
    }

    updateNotes = (notes: string, deckId: number, deckName?: string) => {
        return axios.post(`${UserDeckStore.CONTEXT}/${deckId}/notes`, {notes})
            .then(() => {
                messageStore.setSuccessMessage(deckName == null ? "Notes saved." : `Updated notes for ${deckName}.`, 2000)
                const deck = this.deckNotes?.get(deckId)
                if (deck != null) {
                    deck.notes = notes
                } else {
                    this.deckNotes?.set(deckId, {
                        deckId,
                        notes,
                    })
                }
            })
    }

    findOwned = async () => {
        if (keyLocalStorage.hasAuthKey()) {
            this.loadingOwned = true
            const userDecksList: AxiosResponse<number[]> = await axios.get(`${UserDeckStore.CONTEXT}/owned`)

            this.ownedDecks = userDecksList.data
            this.refreshDeckInfo()
            this.loadingOwned = false
        }
    }

    findNotesForUser = async () => {
        if (keyLocalStorage.hasAuthKey()) {
            this.loadingNotes = true
            const userDecksList: AxiosResponse<DeckNotesDto[]> = await axios.get(`${UserDeckStore.CONTEXT}/notes`)

            const userDecks = new Map()
            userDecksList.data.forEach((userDeck) => userDecks.set(userDeck.deckId, userDeck))
            log.debug(`Deck notes loaded`)

            this.loadingNotes = false
            this.deckNotes = userDecks
        }
    }

    findFavsForUser = async () => {
        if (keyLocalStorage.hasAuthKey()) {
            this.loadingFavs = true
            const userDecksList: AxiosResponse<number[]> = await axios.get(`${UserDeckStore.CONTEXT}/favs`)

            this.loadingFavs = false
            this.favDecks = userDecksList.data
        }
    }

    findFunniesForUser = async () => {
        if (keyLocalStorage.hasAuthKey()) {
            this.loadingFunnies = true
            const userDecksList: AxiosResponse<number[]> = await axios.get(`${UserDeckStore.CONTEXT}/funnies`)

            this.loadingFunnies = false
            this.funnyDecks = userDecksList.data
        }
    }

    userDecksLoaded = () => this.ownedDecks != null && !this.loadingOwned

    ownedByMe = (deckId: number) => this.ownedDecks?.includes(deckId) ?? false

    refreshDeckInfo = () => {
        if (deckStore.deck) {
            const keyforgeId = deckStore.deck.deck.keyforgeId
            deckStore.findDeck(keyforgeId)
            deckStore.findDeckSaleInfo(keyforgeId)
        }
    }

    notesForDeck = (deckId: number): string | undefined => {
        return this.deckNotes?.get(deckId)?.notes
    }

    reset = () => {
        this.ownedDecks = undefined
        this.favDecks = undefined
        this.funnyDecks = undefined
        this.deckNotes = undefined
    }

    constructor() {
        makeObservable(this)
    }
}

export const userDeckStore = new UserDeckStore()
