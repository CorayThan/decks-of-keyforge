import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { auctionStore } from "../auctions/AuctionStore"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { UpdatePrice } from "../userdeck/ListingInfo"
import { SellerDetails } from "./SellerDetails"

export class SellerStore {

    static readonly CONTEXT = HttpConfig.API + "/sellers"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/sellers/secured"

    @observable
    featuredSellers?: SellerDetails[] = undefined

    updatePrices = (prices: UpdatePrice[]) => {
        axios.post(`${SellerStore.SECURE_CONTEXT}/update-prices`, prices)
            .then(() => {
                messageStore.setInfoMessage(`Updated prices for ${prices.length} decks.`)
                auctionStore.findListingsForUser(true)
            })
    }

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
