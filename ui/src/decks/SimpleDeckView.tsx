import { cloneDeep } from "lodash"
import { observer } from "mobx-react"
import * as React from "react"
import { Loader } from "../mui-restyled/Loader"
import { deckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"

/**
 * Doesn't include things like chains or for sale
 */
@observer
export class SimpleDeckView extends React.Component<{ deckId: string }> {

    componentDidMount(): void {
        deckStore.findDeckWithCards(this.props.deckId)
    }

    render() {
        const deck = deckStore.simpleDecks.get(this.props.deckId)
        if (!deck) {
            return <Loader/>
        }
        const cloned = cloneDeep(deck)
        cloned.forTrade = false
        cloned.forSale = false
        return <DeckViewSmall deck={cloned} hideActions={true}/>
    }
}