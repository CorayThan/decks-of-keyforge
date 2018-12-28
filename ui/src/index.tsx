import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { HttpConfig } from "./config/HttpConfig"
import { TextConfig } from "./config/TextConfig"
import { UserStore } from "./user/UserStore"

TextConfig.loadFonts()
HttpConfig.setupAxios()
UserStore.instance.loadLoggedInUser()

ReactDOM.render(<App/>, document.getElementById("root"))
