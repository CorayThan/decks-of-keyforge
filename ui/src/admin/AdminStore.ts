import axios from "axios"
import { cardStore, CardStore } from "../cards/CardStore"

export class AdminStore {

    reloadingCards = false

    reloadCards = async () => {
        this.reloadingCards = true
        await axios.get(`${CardStore.CONTEXT}/reload`)
        await cardStore.loadAllCards()
        this.reloadingCards = false
    }

}

export const adminStore = new AdminStore()
