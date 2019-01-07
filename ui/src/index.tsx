import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { CardStore } from "./cards/CardStore"
import { HttpConfig } from "./config/HttpConfig"
import { TextConfig } from "./config/TextConfig"
import { UserStore } from "./user/UserStore"

TextConfig.loadFonts()
HttpConfig.setupAxios()
UserStore.instance.loadLoggedInUser()
CardStore.instance.loadAllCards()

ReactDOM.render(<App/>, document.getElementById("root"))
