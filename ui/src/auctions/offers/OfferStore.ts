import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { AuctionDto } from "./AuctionDto"
import { BidPlacementResult } from "./BidPlacementResult"
import { MakeOffer } from "./Offer"

export class AuctionStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/offers/secured"

    @observable
    auctionInfo?: AuctionDto

    makeOffer = (deckName: string, makeOffer: MakeOffer) => {
        axios.post(`${AuctionStore.SECURE_CONTEXT}/make-offer`, makeOffer)
            .then(() => {
                messageStore.setSuccessMessage(`Offer sent for ${deckName}.`)
                userStore.loadLoggedInUser()
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

    findAuctionInfo = (auctionId: string) => {
        axios.get(`${AuctionStore.CONTEXT}/${auctionId}`)
            .then((response: AxiosResponse<AuctionDto>) => {
                this.auctionInfo = response.data
            })
    }

    cancel = (deckId: number) => {
        axios.post(`${AuctionStore.SECURE_CONTEXT}/cancel/${deckId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Canceled your auction.`)
                } else {
                    messageStore.setWarningMessage("Couldn't cancel your auction as it has been bid on.")
                }

                userStore.loadLoggedInUser()
                userDeckStore.findAllForUser()
                userDeckStore.refreshDeckInfo()
            })
    }

}

export const auctionStore = new AuctionStore()