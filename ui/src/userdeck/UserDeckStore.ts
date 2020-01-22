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

    @observable
    viewNotes = false

    wishlist = (deckName: string, deckId: number, wishlist: boolean) => {
        this.loadingDecks = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${wishlist ? "" : "un"}wishlist`)
            .then(() => {
                messageStore.setInfoMessage(wishlist ? `Added ${deckName} to your favorites!` : `Removed ${deckName} from your favorites.`)
                this.findAllForUser()
            })
    }

    funny = (deckName: string, deckId: number, funny: boolean) => {
        this.loadingDecks = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${funny ? "" : "un"}funny`)
            .then(() => {
                messageStore.setInfoMessage(funny ? `Marked ${deckName} as funny!` : `Unmarked ${deckName} as funny.`)
                this.findAllForUser()
            })
    }

    owned = (deckName: string, deckId: number, owned: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${owned ? "" : "un"}owned`)
            .then(() => {
                messageStore.setInfoMessage(owned ? `Added ${deckName} to your decks.` : `Removed ${deckName} from your decks.`)
                this.findAllForUser()
            })
    }

    updateNotes = (notes: string, deckId: number, deckName?: string) => {
        return axios.post(`${UserDeckStore.CONTEXT}/${deckId}/notes`, {notes})
            .then(() => {
                messageStore.setInfoMessage(deckName == null ? "Notes saved." : `Updated notes for ${deckName}.`, 2000)

                this.findAllForUser()
            })
    }

    findAllForUser = () => {
        if (keyLocalStorage.hasAuthKey()) {
            this.loadingDecks = true
            axios.get(`${UserDeckStore.CONTEXT}/for-user`)
                .then((response: AxiosResponse) => {
                    const userDecksList: UserDeckDto[] = response.data

                    this.userDecks = new Map()
                    userDecksList.forEach((userDeck) => this.userDecks!.set(userDeck.deckId, userDeck))
                    log.debug(`User decks loaded`)

                    this.refreshDeckInfo()
                    this.loadingDecks = false
                })
        }
    }

    userDecksLoaded = () => this.userDecks != null && !this.loadingDecks

    userDeckByDeckId = (deckId: number) => this.userDecks ? this.userDecks.get(deckId) : undefined

    refreshDeckInfo = () => {
        if (deckStore.deck) {
            const keyforgeId = deckStore.deck.deck.keyforgeId
            deckStore.findDeck(keyforgeId)
            deckStore.findDeckSaleInfo(keyforgeId)
        }
    }
}

export const userDeckStore = new UserDeckStore()
