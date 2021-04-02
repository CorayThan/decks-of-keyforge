import { configure } from "mobx"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { monitoring } from "./config/Monitoring"
import { serverStatusStore } from "./config/ServerStatusStore"
import { TextConfig } from "./config/TextConfig"
import { userMessageStore } from "./messages/UserMessageStore"
import { sellerRatingsStore } from "./sellerratings/SellerRatingsStore"
import { sellerStore } from "./sellers/SellerStore"
import { statsStore } from "./stats/StatsStore"
import { teamStore } from "./teams/TeamStore"
import { userStore } from "./user/UserStore"

configure({enforceActions: "never"})

monitoring.initialize()
TextConfig.loadFonts()
HttpConfig.setupAxios()
serverStatusStore.checkIfUpdating()
cardStore.loadAllCards()
statsStore.findGlobalStats()
sellerRatingsStore.findSellerRatings()
sellerStore.findFeaturedSellers()
userStore.loadUserInfo()
teamStore.findAllTeamNames()
userMessageStore.checkUnreadMessages()

ReactDOM.render(<App/>, document.getElementById("root"))
