import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { MessageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"

export class PatreonStore {
    static readonly CONTEXT = HttpConfig.API + "/patreon"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/patreon/secured"

    @observable
    topPatrons: string[] = []

    linkAccount = (code: string) => {
        axios.post(`${PatreonStore.SECURE_CONTEXT}/link/${code}`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setInfoMessage("You've linked your Patreon account!")
                userStore.loadLoggedInUser()
            })
    }

    unlinkAccount = () => {
        axios.post(`${PatreonStore.SECURE_CONTEXT}/unlink`)
            .then((response: AxiosResponse) => {
                MessageStore.instance.setInfoMessage("You've removed your Patreon account.")
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