import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { log, prettyJson } from "../../config/Utils"
import { DeckListingDto } from "../../generated-src/DeckListingDto"
import { messageStore } from "../../ui/MessageStore"
import { userStore } from "../../user/UserStore"
import { MakeOffer, MyOffers, OfferDto } from "./Offer"

export class OfferStore {

    static readonly CONTEXT = HttpConfig.API + "/offers"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/offers/secured"

    @observable
    auctionInfo?: DeckListingDto

    @observable
    myOffers?: MyOffers

    @observable
    offersToMeIds?: Set<string>

    @observable
    offersFromMeIds?: Set<string>

    @observable
    loadingMyOffers = false

    @observable
    hasOffersToView = false

    @observable
    offersForDeck?: OfferDto[]

    makeOffer = (deckName: string, makeOffer: MakeOffer) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/make-offer`, makeOffer)
            .then(() => {
                messageStore.setSuccessMessage(`Offer sent for ${deckName}.`)
            })
    }

    loadOffersForDeckListing = (listingId: string) => {
        axios.post(`${OfferStore.CONTEXT}/for-deck/${listingId}`)
            .then((response: AxiosResponse<OfferDto[]>) => {
                this.offersForDeck = response.data
            })
    }

    loadMyOffers = (reload: boolean, includeArchived: boolean) => {
        if (!userStore.loggedIn()) {
            return
        }
        if (!reload && this.myOffers != null) {
            return
        }
        this.loadingMyOffers = true
        axios.get(`${OfferStore.SECURE_CONTEXT}/my-offers?include-archived=${includeArchived}`)
            .then((response: AxiosResponse<MyOffers>) => {
                this.loadingMyOffers = false
                this.myOffers = response.data

                this.setupOffersToFromMeIds()

                log.info("Reloaded offers")
            })
    }

    loadSingleOffer = (id: string) => {
        axios.get(`${OfferStore.SECURE_CONTEXT}/${id}`)
            .then((response: AxiosResponse<OfferDto>) => {
                const offer = response.data

                log.info(`Found single offer ${prettyJson(offer)}`)

                if (this.myOffers != null) {
                    this.myOffers.offersToMe.forEach(offersForDeck => {
                        if (offer.deckListingId === offersForDeck.offers[0].deckListingId) {
                            offersForDeck.offers.forEach((toReplace, idx) => {
                                if (offer.id === toReplace.id) {
                                    offersForDeck.offers[idx] = offer
                                }
                            })
                        }
                    })
                    this.myOffers.offersIMade.forEach(offersForDeck => {
                        if (offer.deckListingId === offersForDeck.offers[0].deckListingId) {
                            offersForDeck.offers.forEach((toReplace, idx) => {
                                if (offer.id === toReplace.id) {
                                    offersForDeck.offers[idx] = offer
                                }
                            })
                        }
                    })
                    this.setupOffersToFromMeIds()
                }
            })
    }

    removeSingleOffer = (id: string) => {
        if (this.myOffers != null) {
            this.myOffers.offersToMe = this.myOffers.offersToMe.filter(offersForDeck => {
                const ids = offersForDeck.offers.map(offer => offer.id)
                !ids.includes(id)
            })
            this.setupOffersToFromMeIds()
        }
    }

    private setupOffersToFromMeIds = () => {
        this.offersToMeIds = new Set(this.myOffers!.offersToMe.flatMap(offers => offers.offers).map(offer => offer.id))
        this.offersFromMeIds = new Set(this.myOffers!.offersIMade.flatMap(offers => offers.offers).map(offer => offer.id))
    }

    cancelOffer = (offerId: string) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/cancel/${offerId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Your offer has been cancelled`)
                    this.loadSingleOffer(offerId)
                } else {
                    messageStore.setWarningMessage("Your offer couldn't be cancelled. Please refresh to the page to see the new status.")
                }
            })
    }

    archiveOffer = (offerId: string, archive: boolean) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/archive/${offerId}/${archive}`)
            .then((response: AxiosResponse<boolean>) => {
                const action = archive ? "archived" : "unarchived"
                if (response.data) {
                    this.loadSingleOffer(offerId)
                    messageStore.setSuccessMessage(`You have ${action} the offer`)
                } else {
                    messageStore.setWarningMessage("Couldn't ${action} the offer")
                }
            })
    }

    acceptOffer = (offerId: string) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/accept/${offerId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.removeSingleOffer(offerId)
                    messageStore.setSuccessMessage(`You have accepted the offer and we've emailed the buyer`)
                } else {
                    messageStore.setWarningMessage("You couldn't accept the offer because it has been canceled or expired.")
                }
            })
    }

    rejectOffer = (offerId: string) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/reject/${offerId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    this.loadSingleOffer(offerId)
                    messageStore.setSuccessMessage(`You have rejected the offer`)
                } else {
                    messageStore.setWarningMessage("You couldn't reject the offer because it has been already expired or been canceled.")
                }
            })
    }

    offerIsToMe = (id: string) => {
        if (this.offersToMeIds == null) {
            return false
        }
        return this.offersToMeIds.has(id)
    }

    offerIsFromMe = (id: string) => {
        if (this.offersFromMeIds == null) {
            return false
        }
        return this.offersFromMeIds.has(id)
    }

}

export const offerStore = new OfferStore()
