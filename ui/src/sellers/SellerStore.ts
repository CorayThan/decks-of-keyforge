import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { deckListingStore } from "../auctions/DeckListingStore"
import { HttpConfig } from "../config/HttpConfig"
import { log } from "../config/Utils"
import { SellerDetails } from "../generated-src/SellerDetails"
import { UpdatePrice } from "../generated-src/UpdatePrice"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"

export class SellerStore {
    static readonly CONTEXT = HttpConfig.API + "/sellers"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/sellers/secured"

    @observable
    featuredSellers?: SellerDetails[] = undefined

    @observable
    addingStoreIcon = false

    @observable
    addingStoreBanner = false

    saveStoreImage = async (storeImage: File | Blob, icon: boolean, extension: string) => {
        log.info("icon? " + icon)
        if (icon) {
            this.addingStoreIcon = true
        } else {
            this.addingStoreBanner = true
        }

        const imageData = new FormData()
        imageData.append("storeImage", storeImage)

        await axios.post(
            `${SellerStore.SECURE_CONTEXT}/store-${icon ? "icon" : "banner"}`,
            imageData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Extension": extension
                }
            }
        )

        await userStore.loadLoggedInUser()
        log.info("done reloading for icon / banner")
        if (icon) {
            this.addingStoreIcon = false
        } else {
            this.addingStoreBanner = false
        }
    }

    updatePrices = (prices: UpdatePrice[]) => {
        axios.post(`${SellerStore.SECURE_CONTEXT}/update-prices`, prices)
            .then(() => {
                messageStore.setSuccessMessage(`Updated prices for ${prices.length} decks.`)
                deckListingStore.findListingsForUser(true)
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

    deleteStoreIcon = async () => {
        this.addingStoreIcon = true
        await axios.delete(`${SellerStore.SECURE_CONTEXT}/icon`)
        await userStore.loadLoggedInUser()
        this.addingStoreIcon = false
    }

    deleteStoreBanner = async () => {
        this.addingStoreBanner = true
        await axios.delete(`${SellerStore.SECURE_CONTEXT}/banner`)
        await userStore.loadLoggedInUser()
        this.addingStoreBanner = false
    }

    constructor() {
        makeObservable(this)
    }
}

export const sellerStore = new SellerStore()
