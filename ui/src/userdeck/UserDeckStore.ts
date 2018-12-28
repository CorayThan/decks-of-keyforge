import axios, { AxiosResponse } from "axios"
import { HttpConfig } from "../config/HttpConfig"
import { MessageStore } from "../config/MessageStore"

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
            })
    }

}
