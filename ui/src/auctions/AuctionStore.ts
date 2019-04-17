import axios, { AxiosResponse } from "axios"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { ListingInfo } from "../userdeck/ListingInfo"
import { userDeckStore } from "../userdeck/UserDeckStore"

export class AuctionStore {

    static readonly CONTEXT = HttpConfig.API + "/auctions/secured"

    createAuction = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${AuctionStore.CONTEXT}/list`, listingInfo)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(`Created an auction for ${deckName}.`)
                userDeckStore.findAllForUser()
                userDeckStore.refreshDeckInfo()
            })
    }

}

export const auctionStore = new AuctionStore()
