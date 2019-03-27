import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { CardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { TextConfig } from "./config/TextConfig"
import { StatsStore } from "./stats/StatsStore"
import { userStore } from "./user/UserStore"
import { userDeckStore } from "./userdeck/UserDeckStore"

TextConfig.loadFonts()
HttpConfig.setupAxios()
userStore.loadLoggedInUser()
userDeckStore.findAllForUser()
CardStore.instance.loadAllCards()
StatsStore.instance.findGlobalStats()

ReactDOM.render(<App/>, document.getElementById("root"))
