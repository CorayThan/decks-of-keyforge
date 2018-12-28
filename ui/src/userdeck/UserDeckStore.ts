import axios, { AxiosResponse } from "axios"
import { HttpConfig } from "../config/HttpConfig"
import { MessageStore } from "../config/MessageStore"
import { UserStore } from "../user/UserStore"

export class UserDeckStore {

    static readonly CONTEXT = HttpConfig.API + "/userdeck"
    private static innerInstance: UserDeckStore

    private constructor() {
    }

    static get instance() {
        return this.innerInstance || (this.innerInstance = new this())
    }

    wishlist = (deckName: string, deckId: number, wishlist: boolean) => {
        axios.post(`${UserDeckStore.CONTEXT}/${deckId}/${wishlist ? "" : "un"}wishlist`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setSuccessMessage(wishlist ? `Added ${deckName} to your wishlist!` : `Removed ${deckName} from your wishlist.`)
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

}
