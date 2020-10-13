import "mobx-react/batchingForReactDom"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { deckListingStore } from "./auctions/DeckListingStore"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { monitoring } from "./config/Monitoring"
import { serverStatusStore } from "./config/ServerStatusStore"
import { TextConfig } from "./config/TextConfig"
import { deckOwnershipStore } from "./decks/ownership/DeckOwnershipStore"
import { sellerRatingsStore } from "./sellerratings/SellerRatingsStore"
import { sellerStore } from "./sellers/SellerStore"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

monitoring.initialize()
TextConfig.loadFonts()
HttpConfig.setupAxios()
serverStatusStore.checkIfUpdating()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
deckOwnershipStore.findOwnedDecks()
deckListingStore.findListingsForUser()
cardStore.loadAllCards()
statsStore.findGlobalStats()
sellerRatingsStore.findSellerRatings()
sellerStore.findFeaturedSellers()

ReactDOM.render(<App/>, document.getElementById("root"))
