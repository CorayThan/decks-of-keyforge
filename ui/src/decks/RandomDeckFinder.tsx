import { MenuItem } from "@material-ui/core"
import { MenuItemProps } from "@material-ui/core/MenuItem"
import { observer } from "mobx-react"
import * as React from "react"
import { LinkInfo } from "../generic/LinkMenu"
import { deckStore } from "./DeckStore"

@observer
export class RandomDeckMenuItem extends React.Component<MenuItemProps> {

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
                    if (this.props.onClick) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        this.props.onClick({} as any)
                    }
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
    component: RandomDeckMenuItem,
    randomDeck: true
}
