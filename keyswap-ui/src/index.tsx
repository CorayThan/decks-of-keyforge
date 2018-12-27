import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { HttpConfig } from "./config/HttpConfig"
import { TextConfig } from "./config/TextConfig"

TextConfig.loadFonts()
HttpConfig.setupAxios()

ReactDOM.render(<App/>, document.getElementById("root"))
