import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { messageStore } from "../ui/MessageStore"
import { ListingInfo } from "../userdeck/ListingInfo"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { AuctionDto } from "./AuctionDto"
import { BidPlacementResult } from "./BidPlacementResult"

export class AuctionStore {

    static readonly CONTEXT = HttpConfig.API + "/auctions"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/auctions/secured"

    @observable
    auctionInfo?: AuctionDto

    @observable
    decksForSale?: Map<number, AuctionDto>

    findListingsForUser = (refresh?: boolean) => {
        if (keyLocalStorage.hasAuthKey() && (refresh || this.decksForSale == null)) {
            axios.get(`${AuctionStore.SECURE_CONTEXT}/listings-for-user`)
                .then((response: AxiosResponse<AuctionDto[]>) => {
                    this.decksForSale = new Map()
                    response.data.forEach(auctionDto => {
                        this.decksForSale?.set(auctionDto.deckId, auctionDto)
                    })
                })
        }
    }

    listForSale = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${AuctionStore.SECURE_CONTEXT}/list`, listingInfo)
            .then(() => {
                messageStore.setSuccessMessage(`Created an auction for ${deckName}.`)
                auctionStore.findListingsForUser(true)
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

    findAuctionInfo = (auctionId: string) => {
        axios.get(`${AuctionStore.CONTEXT}/${auctionId}`)
            .then((response: AxiosResponse<AuctionDto>) => {
                this.auctionInfo = response.data
            })
    }

    cancel = (deckName: string, deckId: number) => {
        axios.post(`${AuctionStore.SECURE_CONTEXT}/cancel/${deckId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Canceled your listing for ${deckName}.`)
                } else {
                    messageStore.setWarningMessage(`Couldn't cancel listing of ${deckName}.`)
                }
                this.findListingsForUser(true)
            })
    }

    auctionInfoForDeck = (deckId: number): AuctionDto | undefined => {
        if (this.decksForSale != null) {
            return this.decksForSale.get(deckId)
        }
        return undefined
    }
}

export const auctionStore = new AuctionStore()
