import Divider from "@material-ui/core/Divider/Divider"
import List from "@material-ui/core/List"
import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"

export class KeyDrawer extends React.Component {

    render() {
        return (
            <div>
                <Typography
                    variant={"h4"}
                    style={{flexGrow: 1, marginLeft: spacing(4)}}
                    color={"inherit"}>
                    Decks of Keyforge
                </Typography>
                <Divider/>
                <List>
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
                </List>
            </div>
        )
    }
}