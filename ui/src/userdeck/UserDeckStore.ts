import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { deckStore } from "../decks/DeckStore"
import { messageStore } from "../ui/MessageStore"
import { UserDeckDto } from "./UserDeck"

export class UserDeckStore {

    static readonly CONTEXT = HttpConfig.API + "/userdeck/secured"

    @observable
    userDecks?: Map<number, UserDeckDto>

    @observable
    loadingDecks = false

    wishlist = (deckName: string, deckId: number, wishlist: boolean) => {
        this.loadingDecks = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${wishlist ? "" : "un"}wishlist`)
            .then(() => {
                messageStore.setSuccessMessage(wishlist ? `Added ${deckName} to your favorites!` : `Removed ${deckName} from your favorites.`)
                this.findAllForUser()
            })
    }

    funny = (deckName: string, deckId: number, funny: boolean) => {
        this.loadingDecks = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${funny ? "" : "un"}funny`)
            .then(() => {
                messageStore.setSuccessMessage(funny ? `Marked ${deckName} as funny!` : `Unmarked ${deckName} as funny.`)
                this.findAllForUser()
            })
    }

    owned = (deckName: string, deckId: number, owned: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${owned ? "" : "un"}owned`)
            .then(() => {
                messageStore.setSuccessMessage(owned ? `Added ${deckName} to your decks.` : `Removed ${deckName} from your decks.`)
                this.findAllForUser()
            })
    }

    updateNotes = (notes: string, deckId: number, deckName?: string) => {
        return axios.post(`${UserDeckStore.CONTEXT}/${deckId}/notes`, {notes})
            .then(() => {
                messageStore.setSuccessMessage(deckName == null ? "Notes saved." : `Updated notes for ${deckName}.`, 2000)
                const deck = this.userDecks?.get(deckId)
                if (deck != null) {
                    deck.notes = notes
                }
            })
    }

    findAllForUser = () => {
        if (keyLocalStorage.hasAuthKey()) {
            this.loadingDecks = true
            axios.get(`${UserDeckStore.CONTEXT}/for-user`)
                .then((response: AxiosResponse) => {
                    const userDecksList: UserDeckDto[] = response.data

                    const userDecks = new Map()
                    userDecksList.forEach((userDeck) => userDecks!.set(userDeck.deckId, userDeck))
                    log.debug(`User decks loaded`)

                    this.refreshDeckInfo()
                    this.loadingDecks = false
                    this.userDecks = userDecks
                })
        }
    }

    userDecksLoaded = () => this.userDecks != null && !this.loadingDecks

    userDeckByDeckId = (deckId: number) => this.userDecks ? this.userDecks.get(deckId) : undefined

    ownedByMe = (deckId: number) => this.userDeckByDeckId(deckId)?.ownedBy != null

    refreshDeckInfo = () => {
        if (deckStore.deck) {
            const keyforgeId = deckStore.deck.deck.keyforgeId
            deckStore.findDeck(keyforgeId)
            deckStore.findDeckSaleInfo(keyforgeId)
        }
    }

    notesForDeck = (deckId: number): string | undefined => {
        return this.userDeckByDeckId(deckId)?.notes
    }
}

export const userDeckStore = new UserDeckStore()
