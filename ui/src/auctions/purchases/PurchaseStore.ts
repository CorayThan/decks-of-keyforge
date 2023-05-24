import axios, { AxiosResponse } from "axios"
import { makeObservable, observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { messageStore } from "../../ui/MessageStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { deckListingStore } from "../DeckListingStore"
import { CreatePurchase } from "./CreatePurchase"
import { Purchases } from "./Purchases"
import { PurchaseStats } from "./PurchaseStats"

export class PurchaseStore {
    static readonly CONTEXT = HttpConfig.API + "/purchases"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/purchases/secured"

    @observable
    myPurchases?: Purchases

    @observable
    purchaseStats?: PurchaseStats

    reportPurchase = (deckName: string, createPurchase: CreatePurchase) => {
        axios.post(`${PurchaseStore.SECURE_CONTEXT}`, createPurchase)
            .then((response: AxiosResponse<CreatePurchaseResult>) => {
                deckListingStore.findListingsForUser(true)
                userDeckStore.findOwnedDecks()
                if (response.data.createdOrUpdated) {
                    messageStore.setSuccessMessage(response.data.message)
                } else {
                    messageStore.setWarningMessage(response.data.message)
                }
            })
    }

    findMyPurchases = () => {
        axios.get(`${PurchaseStore.SECURE_CONTEXT}`)
            .then((response: AxiosResponse<Purchases>) => {
                this.myPurchases = response.data
            })
    }

    findPurchaseStats = () => {
        axios.get(`${PurchaseStore.CONTEXT}/stats`)
            .then((response: AxiosResponse<PurchaseStats>) => {
                this.purchaseStats = response.data
            })
    }

    constructor() {
        makeObservable(this)
    }
}

export const purchaseStore = new PurchaseStore()

interface CreatePurchaseResult {
    createdOrUpdated: boolean
    message: string
}
