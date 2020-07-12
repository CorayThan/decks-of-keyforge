import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"

export class PatreonStore {
    static readonly CONTEXT = HttpConfig.API + "/patreon"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/patreon/secured"

    @observable
    topPatrons: string[] = []

    @observable
    linkingPatreon = false

    linkAccount = async (code: string) => {
        this.linkingPatreon = true
        try {
            await axios.post(`${PatreonStore.SECURE_CONTEXT}/link/${code}`)
            await userStore.loadLoggedInUser()
            messageStore.setSuccessMessage("You've linked your Patreon account!")
        } catch (e) {
            messageStore.setWarningMessage("We couldn't link your Patreon account.")
        }
        this.linkingPatreon = false
    }

    unlinkAccount = () => {
        axios.post(`${PatreonStore.SECURE_CONTEXT}/unlink`)
            .then(() => {
                messageStore.setSuccessMessage("You've removed your Patreon account.")
                userStore.loadLoggedInUser()
            })
    }

    findTopPatrons = () => {
        if (this.topPatrons.length === 0) {
            axios.get(`${PatreonStore.CONTEXT}/top-patrons`)
                .then((response: AxiosResponse) => {
                    this.topPatrons = response.data
                })
        }
    }
}

export const patreonStore = new PatreonStore()