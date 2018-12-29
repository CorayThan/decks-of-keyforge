import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { UserStore } from "../../user/UserStore"
import { UserDeckStore } from "../../userdeck/UserDeckStore"
import { Deck } from "../Deck"
import { ListForSaleView } from "../sales/ListForSaleView"

interface MyDecksButtonProps {
    deck: Deck
}

@observer
export class MyDecksButton extends React.Component<MyDecksButtonProps> {

    render() {
        const {id, name} = this.props.deck
        if (!UserStore.instance.loggedIn()) {
            return null
        }
        const userDeck = UserStore.instance.userDeckByDeckId(id)
        const owned = userDeck ? userDeck.owned : false
        const forSale = userDeck && userDeck.forSale
        const forTrade = userDeck && userDeck.forTrade

        let listButton = null
        if (owned) {
            listButton = (
                <ListForSaleView deck={this.props.deck}/>
            )
        }

        return (
            <div style={{display: "flex"}}>
                {forSale || forTrade ? null :
                    (
                        <KeyButton
                            color={"primary"}
                            onClick={() => {
                                UserDeckStore.instance.owned(name, id, !owned)
                            }}
                            style={{marginRight: spacing(2)}}
                        >
                            {owned ? "Not my deck" : "Add to my decks"}
                        </KeyButton>
                    )}
                {listButton}
            </div>
        )
    }
}
