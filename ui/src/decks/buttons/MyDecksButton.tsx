import { observer } from "mobx-react"
import * as React from "react"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { Loader, LoaderSize } from "../../mui-restyled/Loader"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { ListForSaleView } from "../sales/ListForSaleView"
import { DeckActionClickable } from "./DeckActionClickable"

interface MyDecksButtonProps {
    deck: DeckSearchResult
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
        if (!deckListingStore.decksForSaleLoaded) {
            return <Loader size={LoaderSize.SMALL}/>
        }
        const userDeck = userDeckStore.userDeckByDeckId(id)
        const saleInfo = deckListingStore.listingInfoForDeck(id)
        const owned = userDeck ? !!userDeck.ownedBy : false
        const forSale = saleInfo != null

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
