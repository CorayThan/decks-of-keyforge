import "mobx-react/batchingForReactDom"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { monitoring } from "./config/Monitoring"
import { serverStatusStore } from "./config/ServerStatusStore"
import { TextConfig } from "./config/TextConfig"
import { sellerRatingsStore } from "./sellerratings/SellerRatingsStore"
import { sellerStore } from "./sellers/SellerStore"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"

monitoring.initialize()
TextConfig.loadFonts()
HttpConfig.setupAxios()
serverStatusStore.checkIfUpdating()
cardStore.loadAllCards()
statsStore.findGlobalStats()
sellerRatingsStore.findSellerRatings()
sellerStore.findFeaturedSellers()
userStore.loadUserInfo()

export const loadUserInfo = () => {

}

ReactDOM.render(<App/>, document.getElementById("root"))
