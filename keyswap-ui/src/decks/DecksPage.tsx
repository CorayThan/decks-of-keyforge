import Typography from "@material-ui/core/Typography/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyTopbar } from "../layout-parts/KeyTopbar"
import { ToolbarSpacer } from "../mui-restyled/ToolbarSpacer"
import { DecksSearchDrawer } from "./DecksSearchDrawer"
import { DeckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"

@observer
export class DecksPage extends React.Component {

    render() {

        const decks = DeckStore.instance.deckPage

        // Just to have it refresh
        // tslint:disable-next-line
        DeckStore.instance.searchingForDecks

        let decksToDisplay
        if (decks == null) {
            decksToDisplay = (
                <Typography>Search up some decks!</Typography>
            )
        } else {
            decksToDisplay = (
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {decks.decks.map((deck) => (
                        <DeckViewSmall key={deck.id} deck={deck}/>
                    ))}
                </div>
            )
        }

        return (
            <div style={{display: "flex"}}>
                <KeyTopbar name={"Decks"}/>
                <DecksSearchDrawer/>
                <div
                    style={{flexGrow: 1, margin: spacing(2)}}
                >
                    <ToolbarSpacer/>

                    {decksToDisplay}
                </div>
            </div>
        )
    }
}