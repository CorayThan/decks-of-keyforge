import axios, { AxiosResponse } from "axios"
import { computed, makeObservable, observable } from "mobx"
import * as React from "react"
import { HttpConfig } from "../config/HttpConfig"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { Routes } from "../config/Routes"
import { log } from "../config/Utils"
import { DeckFilters } from "../decks/search/DeckFilters"
import { BulkListing } from "../generated-src/BulkListing"
import { DeckListingDto } from "../generated-src/DeckListingDto"
import { ListingInfo } from "../generated-src/ListingInfo"
import { UserDeckListingInfo } from "../generated-src/UserDeckListingInfo"
import { LinkButton } from "../mui-restyled/LinkButton"
import { messageStore } from "../ui/MessageStore"
import { userStore } from "../user/UserStore"
import { userDeckStore } from "../userdeck/UserDeckStore"
import { BidPlacementResult } from "./BidPlacementResult"
import { deckStore } from "../decks/DeckStore";

export class DeckListingStore {
    static readonly CONTEXT = HttpConfig.API + "/deck-listings"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/deck-listings/secured"

    @observable
    listingInfo?: DeckListingDto

    @observable
    decksForSale?: { [key: number]: UserDeckListingInfo }

    @observable
    performingBulkUpdate = false

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
                deckStore.refreshDeckInfo()
            })
    }

    bulkListForSale = async (listing: BulkListing) => {
        this.performingBulkUpdate = true
        const listingResponse: AxiosResponse<number | undefined> = await axios.post(`${DeckListingStore.SECURE_CONTEXT}/bulk-list`, listing)

        await deckListingStore.findListingsForUser(true)
        await deckStore.refreshDeckInfo()
        this.setBulkSaleMessage(listing.decks.length, listingResponse.data)
        this.performingBulkUpdate = false
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

    bulkCancel = async (deckIds: number[]) => {
        this.performingBulkUpdate = true

        for (const deckId in deckIds) {
            await this.cancel(deckIds[deckId])
        }

        await this.findListingsForUser(true)

        messageStore.setSuccessMessage(`Canceled your listings for ${deckIds.length} decks.`)

        this.performingBulkUpdate = false
    }

    bulkSold = async (deckIds: number[]) => {
        this.performingBulkUpdate = true

        for (const deckId in deckIds) {
            await axios.post(`${DeckListingStore.SECURE_CONTEXT}/cancel-and-remove/${deckIds[deckId]}`)
        }

        await this.findListingsForUser(true)
        await userDeckStore.findOwnedDecks()

        messageStore.setSuccessMessage(`Canceled your listings for ${deckIds.length} decks.`)

        this.performingBulkUpdate = false
    }

    cancel = async (deckId: number, deckName?: string) => {
        const cancelResponse: AxiosResponse<boolean> = await axios.post(`${DeckListingStore.SECURE_CONTEXT}/cancel/${deckId}`)

        if (deckName != null) {
            if (cancelResponse.data) {
                messageStore.setSuccessMessage(`Canceled your listing for ${deckName}.`)
            } else {
                messageStore.setWarningMessage(`Couldn't cancel listing of ${deckName}.`)
            }
            this.findListingsForUser(true)
        }

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

    private setBulkSaleMessage = (numberListed: number, tagId?: number) => {

        let link

        if (tagId) {

            const filters = new DeckFilters()
            filters.tags = [tagId]
            filters.forSale = true
            filters.owner = userStore.username ?? ""

            link = (
                <LinkButton
                    color={"inherit"}
                    href={Routes.deckSearch(filters)}
                    key={"listed-decks"}
                    onClick={() => messageStore.open = false}
                >
                    Listed Decks
                </LinkButton>
            )
        }

        messageStore.setMessage(`You've bulk listed / updated ${numberListed} decks!`, "Success", link, 20000)
    }
}

export const deckListingStore = new DeckListingStore()
