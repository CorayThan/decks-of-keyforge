import axios, { AxiosResponse } from "axios"
import { HttpConfig } from "../config/HttpConfig"
import { DeckStore } from "../decks/DeckStore"
import { MessageStore } from "../ui/MessageStore"
import { UserStore } from "../user/UserStore"
import { ListingInfo } from "./ListingInfo"

export class UserDeckStore {

    static readonly CONTEXT = HttpConfig.API + "/userdeck/secured"
    private static innerInstance: UserDeckStore

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    wishlist = (deckName: string, deckId: number, wishlist: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${wishlist ? "" : "un"}wishlist`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(wishlist ? `Added ${deckName} to your favorites!` : `Removed ${deckName} from your favorites.`)
                UserStore.instance.loadLoggedInUser()
            })
    }

    funny = (deckName: string, deckId: number, funny: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${funny ? "" : "un"}funny`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(funny ? `Marked ${deckName} as funny!` : `Unmarked ${deckName} as funny.`)
                UserStore.instance.loadLoggedInUser()
            })
    }

    owned = (deckName: string, deckId: number, owned: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${owned ? "" : "un"}owned`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(owned ? `Added ${deckName} to your decks.` : `Removed ${deckName} from your decks.`)
                UserStore.instance.loadLoggedInUser()
            })
    }

    listDeck = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${UserDeckStore.CONTEXT}/list`, listingInfo)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(`Listed ${deckName} for sale or trade.`)
                UserStore.instance.loadLoggedInUser()
                this.refreshDeckInfo()
            })
    }

    unlist = (deckName: string, deckId: number) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/unlist`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(`${deckName} is no longer listed for sale or trade.`)
                UserStore.instance.loadLoggedInUser()
                this.refreshDeckInfo()
            })
    }

    private refreshDeckInfo = () => {
        if (DeckStore.instance.deck) {
            const keyforgeId = DeckStore.instance.deck.deck.keyforgeId
            DeckStore.instance.findDeck(keyforgeId)
            DeckStore.instance.findDeckSaleInfo(keyforgeId)
        }
    }
}
