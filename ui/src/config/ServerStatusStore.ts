import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { messageStore } from "../ui/MessageStore"
import { HttpConfig } from "./HttpConfig"

export class ServerStatusStore {

    static readonly CONTEXT =  HttpConfig.API + "/status"

    @observable
    siteUpdating = false

    checkIfUpdating = () => axios.get(`${ServerStatusStore.CONTEXT}`)
        .then((response: AxiosResponse<ServerStatus>) => {
            if (response.data.updatingDecks) {
                messageStore.setInfoMessage("SAS / AERC indexes and sorting updating", 3000)
            }
            this.siteUpdating = response.data.siteUpdating
        })

}

export const serverStatusStore = new ServerStatusStore()

interface ServerStatus {
    updatingDecks: boolean,
    siteUpdating: boolean
}
