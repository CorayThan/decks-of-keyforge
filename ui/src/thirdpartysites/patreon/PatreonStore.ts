import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { log } from "../../config/Utils"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"

export class PatreonStore {
    static readonly CONTEXT = HttpConfig.API + "/patreon"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/patreon/secured"

    @observable
    topPatrons: string[] = []

    @observable
    linkingPatreon = false

    @observable
    refreshingPrimaryPatreon = false

    @observable
    refreshToken = ""

    refreshPrimaryAccount = async () => {
        this.refreshingPrimaryPatreon = true
        try {
            await axios.post(`${PatreonStore.SECURE_CONTEXT}/refresh-primary/${this.refreshToken}`)
            messageStore.setSuccessMessage("Refreshed Primary Patreon Account!")
        } catch (e) {
            log.error("Unable to refresh Primary Patreon Account", e)
            messageStore.setWarningMessage("Unable to refresh Primary Patreon Account")
        }
        this.refreshingPrimaryPatreon = false
    }

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

    constructor() {
        makeObservable(this)
    }
}

export const patreonStore = new PatreonStore()