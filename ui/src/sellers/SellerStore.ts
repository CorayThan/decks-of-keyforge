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

    findSellerWithUsername = (username: string) => {
        const sellers = this.featuredSellers
        if (sellers == null) {
            return undefined
        }
        const matches = sellers.filter(seller => seller.username === username)
        if (matches.length === 0) {
            return undefined
        }
        return matches[0]
    }

}

export const sellerStore = new SellerStore()
