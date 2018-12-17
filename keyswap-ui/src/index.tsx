import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./App"
import { TextConfig } from "./config/TextConfig"

TextConfig.loadFonts()

ReactDOM.render(<App/>, document.getElementById("root"))
