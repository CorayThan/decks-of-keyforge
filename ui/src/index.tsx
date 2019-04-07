import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { cardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { TextConfig } from "./config/TextConfig"
import { statsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

TextConfig.loadFonts()
HttpConfig.setupAxios()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
cardStore.loadAllCards()
statsStore.findGlobalStats()

ReactDOM.render(<App/>, document.getElementById("root"))
