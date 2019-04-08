import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { SellerDetails } from "./SellerDetails"

export class SellerStore {

    static readonly CONTEXT = HttpConfig.API + "/sellers"

    @observable
    featuredSellers?: SellerDetails[] = undefined

    findFeaturedSellers = () => {
        axios.get(SellerStore.CONTEXT + "/featured")
            .then((response: AxiosResponse) => {
                this.featuredSellers = response.data
            })
    }

}

export const sellerStore = new SellerStore()
