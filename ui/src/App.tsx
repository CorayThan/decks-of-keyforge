import { CssBaseline } from "@material-ui/core"
import { MuiThemeProvider } from "@material-ui/core/styles"
import * as React from "react"
import { theme } from "./config/MuiConfig"
import { KeyRouter } from "./config/Routes"

export class App extends React.Component {
    render() {
        return (
            <>
                <CssBaseline/>
                <MuiThemeProvider theme={theme}>
                    <KeyRouter/>
                </MuiThemeProvider>
            </>
        )
    }
}
