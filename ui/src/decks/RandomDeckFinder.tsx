import { MenuItem } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import { autorun } from "mobx"
import * as React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { Routes } from "../config/Routes"
import { LinkInfo } from "../generic/LinkMenu"
import { deckStore } from "./DeckStore"

// @ts-ignore
@withRouter
export class RandomDeckMenuItem extends React.Component<MenuItemProps & Partial<RouteComponentProps<{}>>> {

    componentDidMount(): void {
        deckStore.randomDeckId = undefined
    }

    render() {
        return (
            <MenuItem
                style={{justifyContent: "center"}}
                onClick={() => {
                    deckStore.deck = undefined
                    deckStore.findRandomDeckId()
                    const autoRunCancel = autorun(() => {
                        if (this.props.history && deckStore.randomDeckId) {
                            this.props.history.push(Routes.deckPage(deckStore.randomDeckId))
                            if (this.props.onClick) {
                                // tslint:disable-next-line:no-any
                                this.props.onClick({} as any)
                            }
                            autoRunCancel()
                        }
                    })
                }}
            >
                I Feel Lucky
            </MenuItem>
        )
    }
}

export const randomDeckMenuItem: LinkInfo = {
    text: "I Feel Lucky",
    mobileActive: true,
    component: RandomDeckMenuItem
}
