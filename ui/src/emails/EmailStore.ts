import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { MessageStore } from "../ui/MessageStore"
import { SellerMessage } from "./SellerMessage"

class EmailStore {

    static readonly CONTEXT = HttpConfig.API + "/emails"

    @observable
    sendingSellerMessage = false

    @observable
    sentSellerMessage = false

    @observable
    sendingReset = false

    sendSellerMessage = async (message: SellerMessage) => {
        this.sendingSellerMessage = true
        await axios.post(`${EmailStore.CONTEXT}/seller-message`, message)
        this.sendingSellerMessage = false
        this.sentSellerMessage = true
        MessageStore.instance.setSuccessMessage(`We've sent your message to the user who listed this deck.`)
    }

    sendReset = (email: string) => {
        this.sendingReset = true
        axios.post(`${EmailStore.CONTEXT}/send-reset`, {email})
            .then((response: AxiosResponse) => {
                this.sendingReset = false
                MessageStore.instance.setSuccessMessage(`A reset email has been sent to ${email}`)
            })
    }

}

export const emailStore = new EmailStore()
