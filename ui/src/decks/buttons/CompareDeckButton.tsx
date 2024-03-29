import { observer } from "mobx-react"
import * as React from "react"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { userStore } from "../../user/UserStore"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { DeckActionClickable } from "./DeckActionClickable"

interface CompareDeckButtonProps {
    deck: DeckSearchResult
    menuItem?: boolean
    onClick?: () => void
}

@observer
export class CompareDeckButton extends React.Component<CompareDeckButtonProps> {

    render() {
        const {menuItem, deck, onClick} = this.props
        if (!userStore.loggedIn()) {
            return null
        }

        return (
            <DeckActionClickable
                disabled={!userStore.patron}
                onClick={() => {
                    keyLocalStorage.addDeckToCompare({
                        keyforgeId: deck.keyforgeId,
                        name: deck.name,
                        type: deck.deckType,
                    })
                    if (onClick) {
                        onClick()
                    }
                }}
                menuItem={menuItem}
            >
                Compare
            </DeckActionClickable>
        )
    }
}
