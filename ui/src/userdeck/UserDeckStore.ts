import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { deckStore } from "../decks/DeckStore"
import { messageStore } from "../ui/MessageStore"
import { ListingInfo } from "./ListingInfo"
import { UserDeckDto } from "./UserDeck"

export class UserDeckStore {

    static readonly CONTEXT = HttpConfig.API + "/userdeck/secured"

    @observable
    userDecks?: Map<number, UserDeckDto>

    @observable
    loadingDecks: boolean = false

    wishlist = (deckName: string, deckId: number, wishlist: boolean) => {
        this.loadingDecks = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${wishlist ? "" : "un"}wishlist`)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(wishlist ? `Added ${deckName} to your favorites!` : `Removed ${deckName} from your favorites.`)
                this.findAllForUser()
            })
    }

    funny = (deckName: string, deckId: number, funny: boolean) => {
        this.loadingDecks = true
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${funny ? "" : "un"}funny`)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(funny ? `Marked ${deckName} as funny!` : `Unmarked ${deckName} as funny.`)
                this.findAllForUser()
            })
    }

    owned = (deckName: string, deckId: number, owned: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${owned ? "" : "un"}owned`)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(owned ? `Added ${deckName} to your decks.` : `Removed ${deckName} from your decks.`)
                this.findAllForUser()
            })
    }

    listDeck = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${UserDeckStore.CONTEXT}/list`, listingInfo)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(`Listed ${deckName} for sale or trade.`)
                this.findAllForUser()
                this.refreshDeckInfo()
            })
    }

    unlist = (deckName: string, deckId: number) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/unlist`)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(`${deckName} is no longer listed for sale or trade.`)
                this.findAllForUser()
                this.refreshDeckInfo()
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
