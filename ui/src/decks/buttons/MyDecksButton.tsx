import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { Deck } from "../Deck"
import { ListForSaleView } from "../sales/ListForSaleView"

interface MyDecksButtonProps {
    deck: Deck
}

@observer
export class MyDecksButton extends React.Component<MyDecksButtonProps> {

    render() {
        const {id, name} = this.props.deck
        if (!userStore.loggedIn()) {
            return null
        }
        const userDeck = userDeckStore.userDeckByDeckId(id)
        const owned = userDeck ? !!userDeck.ownedBy : false
        const forSale = userDeck && userDeck.forSale
        const forTrade = userDeck && userDeck.forTrade
        const forAuction = userDeck && userDeck.forAuction

        let listButton = null
        if (owned) {
            listButton = (
                <ListForSaleView deck={this.props.deck}/>
            )
        }

        return (
            <div style={{display: "flex"}}>
                {forSale || forTrade || forAuction ? null :
                    (
                        <KeyButton
                            color={"primary"}
                            onClick={() => {
                                userDeckStore.owned(name, id, !owned)
                            }}
                            style={{marginRight: spacing(1)}}
                        >
                            {owned ? "Not mine" : "Add to my decks"}
                        </KeyButton>
                    )}
                {listButton}
            </div>
        )
    }
}
