import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"

export class SellerStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/sellers/secured"

    @observable
    apiKey?: string

    @observable
    generatingApiKey = false

    generateApiKey = () => {
        this.generatingApiKey = true
        axios.post(SellerStore.SECURE_CONTEXT)
            .then((response: AxiosResponse) => {
                this.generatingApiKey = false
                this.apiKey = response.data
            })
    }

}

export const sellerStore = new SellerStore()
