import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"

export class PublicApiStore {
    static readonly API_KEYS_CONTEXT = "/public-api/api-keys/secured"

    @observable
    apiKey?: string

    @observable
    generatingApiKey = false

    generateApiKey = () => {
        this.generatingApiKey = true
        axios.post(PublicApiStore.API_KEYS_CONTEXT)
            .then((response: AxiosResponse) => {
                this.generatingApiKey = false
                this.apiKey = response.data
            })
    }

    constructor() {
        makeObservable(this)
    }
}

export const publicApiStore = new PublicApiStore()
