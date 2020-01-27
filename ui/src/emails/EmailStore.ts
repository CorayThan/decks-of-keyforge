import axios from "axios"
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
            .then(() => {
                this.sendingReset = false
                messageStore.setSuccessMessage(`A reset email has been sent to ${email}`)
            })
    }

    sendEmailVerification = () => {
        let email = userStore.sellerEmail
        if (email == null) {
            email = userStore.email
        }
        if (email == null) {
            messageStore.setWarningMessage("Please login to send an email verification.")
        } else {
            this.sendingEmailVerification = true
            axios.post(`${EmailStore.CONTEXT}/send-email-verification`, {email})
                .then(() => {
                    this.sendingEmailVerification = false
                    messageStore.setSuccessMessage(`An email verification message has been sent to ${email}`)
                })
        }
    }

}

export const emailStore = new EmailStore()
