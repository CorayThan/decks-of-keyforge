import AppBar from "@material-ui/core/AppBar/AppBar"
import Toolbar from "@material-ui/core/Toolbar/Toolbar"
import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"

interface KeyTopbarProps {
    name: string
}

export class KeyTopbar extends React.Component<KeyTopbarProps> {
    render() {
        const {name} = this.props
        return (
            <AppBar position={"fixed"} style={{zIndex: 10000}}>
                <Toolbar>
                    <Typography
                        variant={"h4"}
                        style={{flexGrow: 1, marginLeft: spacing(4)}}
                        color={"inherit"}>
                        {name}
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