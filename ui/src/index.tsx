import * as Sentry from "@sentry/browser"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { deckListingStore } from "./auctions/DeckListingStore"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { serverStatusStore } from "./config/ServerStatusStore"
import { TextConfig } from "./config/TextConfig"
import { Utils } from "./config/Utils"
import { sellerStore } from "./sellers/SellerStore"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

if (!Utils.isDev()) {
    Sentry.init({dsn: "https://a5837898c7064942aeedad8a70803b0f@o394170.ingest.sentry.io/5243978"})
}

TextConfig.loadFonts()
HttpConfig.setupAxios()
serverStatusStore.checkIfUpdating()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
deckListingStore.findListingsForUser()
cardStore.loadAllCards()
statsStore.findGlobalStats()
sellerStore.findFeaturedSellers()

ReactDOM.render(<App/>, document.getElementById("root"))
