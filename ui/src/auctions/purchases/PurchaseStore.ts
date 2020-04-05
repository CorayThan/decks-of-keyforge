import axios, { AxiosResponse } from "axios"
import { observable } from "mobx"
import { HttpConfig } from "../../config/HttpConfig"
import { messageStore } from "../../ui/MessageStore"
import { CreatePurchase } from "./CreatePurchase"
import { Purchases } from "./Purchases"

export class PurchaseStore {

    static readonly CONTEXT = HttpConfig.API + "/purchases"
    static readonly SECURE_CONTEXT = HttpConfig.API + "/purchases/secured"

    @observable
    myPurchases?: Purchases

    reportPurchase = (deckName: string, createPurchase: CreatePurchase) => {
        axios.post(`${PurchaseStore.SECURE_CONTEXT}`, createPurchase)
            .then(() => {
                if (createPurchase.buyerId == null) {
                    messageStore.setSuccessMessage(`Created sale record and removed ${deckName} from your decks.`)
                } else {
                    messageStore.setSuccessMessage(`Created purchase record for ${deckName}.`)
                }
            })
    }

    findMyPurchases = () => {
        axios.get(`${PurchaseStore.SECURE_CONTEXT}`)
            .then((response: AxiosResponse<Purchases>) => {
                this.myPurchases = response.data
            })
    }

}

export const purchaseStore = new PurchaseStore()
