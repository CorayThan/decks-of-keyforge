import AppBar from "@material-ui/core/AppBar/AppBar"
import Toolbar from "@material-ui/core/Toolbar/Toolbar"
import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"

export class KeyTopBar extends React.Component {
    render() {
        return (
            <AppBar position={"static"}>
                <Toolbar>
                    <Typography
                        variant={"h4"}
                        style={{flexGrow: 1, marginLeft: spacing(4)}}
                        color={"inherit"}>
                        Decks of Keyforge
                    </Typography>
                    <LinkButton
                        color={"inherit"}
                        style={{marginRight: spacing(2)}}
                        to={Routes.cards}
                    >
                        Cards
                    </LinkButton>
                    <LinkButton
                        color={"inherit"}
                        style={{marginRight: spacing(2)}}
                        to={Routes.decks}
                    >
                        Decks
                    </LinkButton>
                </Toolbar>
            </AppBar>
        )
    }
}