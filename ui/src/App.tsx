import { CssBaseline } from "@material-ui/core"
import { MuiThemeProvider } from "@material-ui/core/styles"
import { observer } from "mobx-react"
import * as React from "react"
import { theme, themeStore } from "./config/MuiConfig"
import { KeyRouter } from "./config/Routes"

@observer
export class App extends React.Component {
    render() {
        return (
            <>
                <style>
                    {`body { background-color: ${themeStore.backgroundColor}; }`}
                </style>
                <CssBaseline/>
                <MuiThemeProvider theme={theme}>
                    <KeyRouter/>
                </MuiThemeProvider>
            </>
        )
    }
}
