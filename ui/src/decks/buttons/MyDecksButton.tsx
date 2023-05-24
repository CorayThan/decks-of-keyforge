import { observer } from "mobx-react"
import * as React from "react"
import { deckListingStore } from "../../auctions/DeckListingStore"
import { Loader, LoaderSize } from "../../mui-restyled/Loader"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { ListForSaleView } from "../sales/ListForSaleView"
import { DeckActionClickable } from "./DeckActionClickable"
import { DeckType } from "../../generated-src/DeckType";
import { allianceDeckStore } from "../../alliancedecks/AllianceDeckStore";

interface MyDecksButtonProps {
    deck: DeckSearchResult
    menuItem?: boolean
}

@observer
export class MyDecksButton extends React.Component<MyDecksButtonProps> {

    render() {
        const {menuItem} = this.props
        const {id, keyforgeId, name, deckType} = this.props.deck
        const alliance = deckType === DeckType.ALLIANCE
        if (!userStore.loggedIn()) {
            return null
        }

        if (alliance && !userStore.patron) {
            return null
        }

        if (!deckListingStore.decksForSaleLoaded) {
            return <Loader size={LoaderSize.SMALL}/>
        }
        const saleInfo = deckListingStore.listingInfoForDeck(id)
        const owned = userDeckStore.ownedByMe(this.props.deck)
        const forSale = saleInfo != null

        let listButton = null
        if (owned && !alliance) {
            listButton = (
                <ListForSaleView deck={this.props.deck} menuItem={menuItem}/>
            )
        }

        return (
            <>
                {forSale && owned ? null :
                    (
                        <DeckActionClickable
                            onClick={() => {
                                if (alliance) {
                                    if (owned) {
                                        allianceDeckStore.markNotOwned(keyforgeId, name)
                                    } else {
                                        allianceDeckStore.markOwned(keyforgeId, name)
                                    }
                                } else {
                                    userDeckStore.owned(name, id, !owned)
                                }
                            }}
                            menuItem={menuItem}
                            disabled={(alliance ? userDeckStore.loadingOwnedAlliances : userDeckStore.loadingOwned)}
                        >
                            {owned ? "Not mine" : "My Deck"}
                        </DeckActionClickable>
                    )}
                {listButton}
            </>
        )
    }
}
