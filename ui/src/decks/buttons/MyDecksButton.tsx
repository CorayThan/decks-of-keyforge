import { observer } from "mobx-react"
import * as React from "react"
import { auctionStore } from "../../auctions/AuctionStore"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { Deck } from "../Deck"
import { ListForSaleView } from "../sales/ListForSaleView"
import { DeckActionClickable } from "./DeckActionClickable"

interface MyDecksButtonProps {
    deck: Deck
    menuItem?: boolean
}

@observer
export class MyDecksButton extends React.Component<MyDecksButtonProps> {

    render() {
        const {menuItem} = this.props
        const {id, name} = this.props.deck
        if (!userStore.loggedIn()) {
            return null
        }
        const userDeck = userDeckStore.userDeckByDeckId(id)
        const saleInfo = auctionStore.auctionInfoForDeck(id)
        const owned = userDeck ? !!userDeck.ownedBy : false
        let forSale = saleInfo != null

        let listButton = null
        if (owned) {
            listButton = (
                <ListForSaleView deck={this.props.deck} menuItem={menuItem}/>
            )
        }

        return (
            <>
                {forSale ? null :
                    (
                        <DeckActionClickable
                            onClick={() => {
                                userDeckStore.owned(name, id, !owned)
                            }}
                            menuItem={menuItem}
                        >
                            {owned ? "Not mine" : "Add to My Decks"}
                        </DeckActionClickable>
                    )}
                {listButton}
            </>
        )
    }
}
