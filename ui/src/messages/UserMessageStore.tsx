import { Button } from "@material-ui/core"
import axios from "axios"
import { makeObservable, observable } from "mobx"
import * as React from "react"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { MyDokSubPaths } from "../config/Routes"
import { MessagesSearchFilters } from "../generated-src/MessagesSearchFilters"
import { PrivateMessageDto } from "../generated-src/PrivateMessageDto"
import { SendMessage } from "../generated-src/SendMessage"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"

class UserMessageStore {
    static readonly SECURE_CONTEXT = HttpConfig.API + "/messages/secured"

    @observable
    sendingSellerMessage = false

    @observable
    sentSellerMessage = false

    @observable
    messages?: PrivateMessageDto[]

    @observable
    message?: PrivateMessageDto

    @observable
    searchingMessages = false

    @observable
    readTimes: Map<number, string> = new Map()

    findMessage = async (id: number) => {
        const messageResponse = await axios.get(`${UserMessageStore.SECURE_CONTEXT}/${id}`)
        this.message = messageResponse.data
    }

    searchMessages = async (filters: MessagesSearchFilters) => {

        this.searchingMessages = true
        const userId = userStore.userId

        if (userId == null) {
            return
        }

        const messagesResponse = await axios.post(`${UserMessageStore.SECURE_CONTEXT}/search`, filters)

        this.messages = messagesResponse.data
        this.searchingMessages = false
    }

    sendMessage = async (message: SendMessage, deckName?: string) => {
        this.sendingSellerMessage = true
        await axios.post(`${UserMessageStore.SECURE_CONTEXT}/send`, message)
        this.sendingSellerMessage = false
        this.sentSellerMessage = true

        let successMessage = `We've sent your message!`
        if (deckName != null) {
            successMessage = `Your message about ${deckName} has been sent!`
        } else {
            successMessage = `We've sent your message to ${message.toUsername}!`
        }

        messageStore.setSuccessMessage(successMessage)
    }

    archiveMessage = async (id: number, archive: boolean) => {
        await axios.post(`${UserMessageStore.SECURE_CONTEXT}/${id}/archive/${archive}`)
    }

    markRead = async (id: number) => {
        const readResponse = await axios.post(`${UserMessageStore.SECURE_CONTEXT}/${id}/mark-read`)
        const readTime: string = readResponse.data
        this.readTimes.set(id, readTime)
    }

    checkUnreadMessages = async () => {
        if (keyLocalStorage.hasAuthKey()) {

            const unreadResponse = await axios.get(`${UserMessageStore.SECURE_CONTEXT}/unread-count`)
            const unreadCount: number = unreadResponse.data

            if (unreadCount > 0) {
                messageStore.setMessage(
                    `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}. `,
                    "Success",
                    (
                        <Button
                            color={"inherit"}
                            href={MyDokSubPaths.messages}
                            key={"messages"}
                            onClick={() => messageStore.open = false}
                        >
                            Messages
                        </Button>
                    ),
                    20000
                )
            }
        }
    }

    constructor() {
        makeObservable(this)
    }
}

export const userMessageStore = new UserMessageStore()
