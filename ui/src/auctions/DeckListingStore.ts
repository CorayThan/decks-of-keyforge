import axios, { AxiosResponse } from "axios"
import { computed, makeObservable, observable } from "mobx"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { log } from "../config/Utils"
import { DeckListingDto } from "../generated-src/DeckListingDto"
import { ListingInfo } from "../generated-src/ListingInfo"
import { UserDeckListingInfo } from "../generated-src/UserDeckListingInfo"
import { messageStore } from "../ui/MessageStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { BidPlacementResult } from "./BidPlacementResult"

export class DeckListingStore {
    static readonly CONTEXT = HttpConfig.API + "/deck-listings"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/deck-listings/secured"

    @observable
    listingInfo?: DeckListingDto

    @observable
    decksForSale?: { [key: number]: UserDeckListingInfo }

    findListingsForUser = (refresh?: boolean) => {
        if (keyLocalStorage.hasAuthKey() && (refresh || this.decksForSale == null)) {
            axios.get(`${DeckListingStore.SECURE_CONTEXT}/listings-for-user`)
                .then((response: AxiosResponse<UserDeckListingInfo[]>) => {
                    const decksToSell: { [key: number]: UserDeckListingInfo } = {}
                    response.data.forEach(auctionDto => {
                        decksToSell[auctionDto.deckId] = auctionDto
                    })
                    this.decksForSale = decksToSell
                })
        } else {
            log.debug(`Skip listings for user request due to ${keyLocalStorage.hasAuthKey()} ${refresh} ${this.decksForSale == null}`)
        }
    }

    listForSale = (deckName: string, listingInfo: ListingInfo) => {
        axios.post(`${DeckListingStore.SECURE_CONTEXT}/list`, listingInfo)
            .then(() => {
                let message = `You've listed ${deckName} for sale.`
                if (listingInfo.startingBid != null) {
                    message = `Created an auction for ${deckName}.`
                } else if (listingInfo.editAuctionId != null) {
                    message = `You've updated the listing for ${deckName}.`
                }
                messageStore.setSuccessMessage(message)
                deckListingStore.findListingsForUser(true)
                userDeckStore.refreshDeckInfo()
            })
    }

    bid = (auctionId: string, bid: number) => {
        return axios.post(`${DeckListingStore.SECURE_CONTEXT}/bid/${auctionId}/${bid}`)
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
        return axios.post(`${DeckListingStore.SECURE_CONTEXT}/buy-it-now/${auctionId}`)
            .then((response: AxiosResponse<BidPlacementResult>) => {
                const result = response.data
                if (result.successful && result.youAreHighBidder) {
                    messageStore.setSuccessMessage(result.message)
                } else {
                    messageStore.setWarningMessage(result.message)
                }
            })
    }

    findDeckListingInfo = (auctionId: string) => {
        this.listingInfo = undefined
        return axios.get(`${DeckListingStore.CONTEXT}/${auctionId}`)
            .then((response: AxiosResponse<DeckListingDto>) => {
                this.listingInfo = response.data
            })
    }

    cancel = (deckName: string, deckId: number) => {
        axios.post(`${DeckListingStore.SECURE_CONTEXT}/cancel/${deckId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Canceled your listing for ${deckName}.`)
                } else {
                    messageStore.setWarningMessage(`Couldn't cancel listing of ${deckName}.`)
                }
                this.findListingsForUser(true)
            })
    }

    removeAllDecks = async (password: string) => {
        log.info("Start removing all decks.")
        await axios.post(`${DeckListingStore.SECURE_CONTEXT}/remove-all`, {password})
        messageStore.setSuccessMessage("All decks added to your account have been removed.")
    }

    listingInfoForDeck = (deckId: number): UserDeckListingInfo | undefined => {
        if (this.decksForSale != null) {
            return this.decksForSale[deckId]
        }
        return undefined
    }

    constructor() {
        makeObservable(this)
    }

    @computed
    get decksForSaleLoaded(): boolean {
        return this.decksForSale != null
    }
}

export const deckListingStore = new DeckListingStore()
