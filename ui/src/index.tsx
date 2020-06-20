import * as Sentry from "@sentry/browser"
import "mobx-react/batchingForReactDom"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { deckListingStore } from "./auctions/DeckListingStore"
import { cardStore } from "./cards/CardStore"
import { CheckBrowser } from "./config/CheckBrowser"
import { HttpConfig } from "./config/HttpConfig"
import { serverStatusStore } from "./config/ServerStatusStore"
import { TextConfig } from "./config/TextConfig"
import { Utils } from "./config/Utils"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

const isValidBrowser = CheckBrowser.check()

if (!Utils.isDev() && isValidBrowser) {
    Sentry.init({
        dsn: "https://a5837898c7064942aeedad8a70803b0f@o394170.ingest.sentry.io/5243978",
        ignoreErrors: [
            "Request failed with status code 401",
            "Request failed with status code 404",
            "Non-Error promise rejection captured with keys: message",
            "AbortError: Share canceled",
            "AbortError: Abort due to cancellation of share ",
        ],
        whitelistUrls: [
            "decksofkeyforge.com"
        ]
    })
}

// Remove eventually
class Cache {
    private static readonly ETAG_KEY = "ETAG"
    private storage = window.localStorage

    clearAll = () => {
        if (this.storage) {
            Object.keys(this.storage).forEach((key) => {
                if (key.includes(Cache.ETAG_KEY)) {
                    this.storage.removeItem(key)
                }
            })
        }
    }
}

const cache = new Cache()
cache.clearAll()


TextConfig.loadFonts()
HttpConfig.setupAxios()
serverStatusStore.checkIfUpdating()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
deckListingStore.findListingsForUser()
cardStore.loadAllCards()
statsStore.findGlobalStats()

ReactDOM.render(<App/>, document.getElementById("root"))
