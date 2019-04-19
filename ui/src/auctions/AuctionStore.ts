import axios, { AxiosResponse } from "axios"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { ListingInfo } from "../userdeck/ListingInfo"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { BidPlacementResult } from "./BidPlacementResult"

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

    bid = (auctionId: string, bid: number) => {
        return axios.post(`${AuctionStore.CONTEXT}/bid/${auctionId}/${bid}`)
            .then((response: AxiosResponse<BidPlacementResult>) => {
                const result = response.data
                if (result.successful && result.youAreHighBidder) {
                    messageStore.setSuccessMessage(result.message)
                } else {
                    messageStore.setWarningMessage(result.message)
                }
            })
    }
}

export const auctionStore = new AuctionStore()
