import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { SellerMessage } from "./SellerMessage"

class EmailStore {

    static readonly CONTEXT = HttpConfig.API + "/emails"

    @observable
    sendingSellerMessage = false

    @observable
    sentSellerMessage = false

    @observable
    sendingReset = false

    @observable
    sendingEmailVerification = false

    sendSellerMessage = async (message: SellerMessage) => {
        this.sendingSellerMessage = true
        await axios.post(`${EmailStore.CONTEXT}/seller-message`, message)
        this.sendingSellerMessage = false
        this.sentSellerMessage = true
        messageStore.setSuccessMessage(`We've sent your message to the user who listed this deck.`)
    }

    sendReset = (email: string) => {
        this.sendingReset = true
        axios.post(`${EmailStore.CONTEXT}/send-reset`, {email})
            .then((response: AxiosResponse) => {
                this.sendingReset = false
                messageStore.setInfoMessage(`A reset email has been sent to ${email}`)
            })
    }

    sendEmailVerification = () => {
        const email = userStore.email
        if (email == null) {
            messageStore.setWarningMessage("Please login to send an email verification.")
        } else {
            this.sendingEmailVerification = true
            axios.post(`${EmailStore.CONTEXT}/send-email-verification`, {email})
                .then((response: AxiosResponse) => {
                    this.sendingEmailVerification = false
                    messageStore.setInfoMessage(`An email verification message has been sent to ${email}`)
                })
        }
    }

}

export const emailStore = new EmailStore()
