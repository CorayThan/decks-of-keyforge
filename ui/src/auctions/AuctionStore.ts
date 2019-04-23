import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { messageStore } from "../ui/MessageStore"
import { ListingInfo } from "../userdeck/ListingInfo"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { AuctionDto, AuctionStatus } from "./AuctionDto"
import { BidPlacementResult } from "./BidPlacementResult"

export class AuctionStore {

    static readonly CONTEXT = HttpConfig.API + "/auctions"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/auctions/secured"

    @observable
    auctionInfo?: AuctionDto

    @observable
    sellerAuctions?: Map<number, AuctionDto>

    createAuction = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${AuctionStore.SECURE_CONTEXT}/list`, listingInfo)
            .then((response: AxiosResponse) => {
                messageStore.setSuccessMessage(`Created an auction for ${deckName}.`)
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

    findMyActiveAuctions = () => {
        axios.get(`${AuctionStore.SECURE_CONTEXT}/seller/${AuctionStatus.ACTIVE}`)
            .then((response: AxiosResponse<AuctionDto[]>) => {
                const auctionsList: AuctionDto[] = response.data

                this.sellerAuctions = new Map()
                auctionsList.forEach((auction) => this.sellerAuctions!.set(auction.deckId, auction))
            })
    }

    auctionByDeckId = (deckId: number) => this.sellerAuctions ? this.sellerAuctions.get(deckId) : undefined
}

export const auctionStore = new AuctionStore()
