import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { ListingInfo } from "../userdeck/ListingInfo"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { AuctionDto } from "./AuctionDto"
import { BidPlacementResult } from "./BidPlacementResult"

export class AuctionStore {

    static readonly CONTEXT = HttpConfig.API + "/auctions"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/auctions/secured"

    @observable
    auctionInfo?: AuctionDto

    createAuction = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${AuctionStore.SECURE_CONTEXT}/list`, listingInfo)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(`Created an auction for ${deckName}.`)
                userStore.loadLoggedInUser()
                userDeckStore.findAllForUser()
                userDeckStore.refreshDeckInfo()
            })
    }

    bid = (auctionId: string, bid: number) => {
        return axios.post(`${AuctionStore.SECURE_CONTEXT}/bid/${auctionId}/${bid}`)
            .then((response: AxiosResponse<BidPlacementResult>) => {
                const result = response.data
                if (result.successful && result.youAreHighBidder) {
                    messageStore.setSuccessMessage(result.message)
                } else {
                    messageStore.setWarningMessage(result.message)
                }
            })
    }

    buyItNow = (auctionId: string) => {
        return axios.post(`${AuctionStore.SECURE_CONTEXT}/buy-it-now/${auctionId}`)
            .then((response: AxiosResponse<BidPlacementResult>) => {
                const result = response.data
                if (result.successful && result.youAreHighBidder) {
                    messageStore.setSuccessMessage(result.message)
                } else {
                    messageStore.setWarningMessage(result.message)
                }
            })
    }

    findAuctionInfo = (auctionId: string) =>  {
        axios.get(`${AuctionStore.CONTEXT}/${auctionId}`)
            .then((response: AxiosResponse<AuctionDto>) => {
                this.auctionInfo = response.data
            })
    }

}

export const auctionStore = new AuctionStore()
