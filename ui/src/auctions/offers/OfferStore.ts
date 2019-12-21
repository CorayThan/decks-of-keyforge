import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { messageStore } from "../../ui/MessageStore"
import { AuctionDto } from "../AuctionDto"
import { MyOffers } from "./MyOffers"
import { MakeOffer } from "./Offer"

export class OfferStore {

    static readonly SECURE_CONTEXT = HttpConfig.API + "/offers/secured"

    @observable
    auctionInfo?: AuctionDto

    @observable
    myOffers?: MyOffers

    @observable
    loadingMyOffers = false

    makeOffer = (deckName: string, makeOffer: MakeOffer) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/make-offer`, makeOffer)
            .then(() => {
                messageStore.setSuccessMessage(`Offer sent for ${deckName}.`)
                this.loadMyOffers()
            })
    }

    loadMyOffers = () => {
        this.loadingMyOffers = true
        axios.get(`${OfferStore.SECURE_CONTEXT}/my-offers`)
            .then((response: AxiosResponse<MyOffers>) => {
                this.loadingMyOffers = false
                this.myOffers = response.data
            })
    }

    cancelOffer = (offerId: string) => {
        axios.post(`${OfferStore.SECURE_CONTEXT}/cancel/${offerId}`)
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    messageStore.setSuccessMessage(`Your offer has been cancelled`)
                } else {
                    messageStore.setWarningMessage("Your offer couldn't be cancelled as it was already accepted.")
                }
                this.loadMyOffers()
            })
    }

}

export const offerStore = new OfferStore()
