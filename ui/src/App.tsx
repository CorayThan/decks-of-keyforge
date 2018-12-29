import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import * as React from "react"
import { muiTheme } from "./config/MuiConfig"
import { KeyRouter } from "./config/Routes"
import { SnackMessage } from "./ui/MessageStore"

export class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={muiTheme}>
                <KeyRouter/>
                <SnackMessage/>
            </MuiThemeProvider>
        )
    }
}
