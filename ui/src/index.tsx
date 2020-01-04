import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { offerStore } from "./auctions/offers/OfferStore"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { TextConfig } from "./config/TextConfig"
import { deckStore } from "./decks/DeckStore"
import { sellerStore } from "./sellers/SellerStore"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

TextConfig.loadFonts()
HttpConfig.setupAxios()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
cardStore.loadAllCards()
statsStore.findGlobalStats()
sellerStore.findFeaturedSellers()
deckStore.checkIfUpdating()
offerStore.loadHasOffersToView()

ReactDOM.render(<App/>, document.getElementById("root"))
