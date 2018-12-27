import Typography from "@material-ui/core/Typography"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { KeyTopbar } from "../layout-parts/KeyTopbar"
import { KeyButton } from "../mui-restyled/KeyButton"
import { Loader } from "../mui-restyled/Loader"
import { DecksSearchDrawer } from "./DecksSearchDrawer"
import { DeckStore } from "./DeckStore"
import { DeckViewSmall } from "./DeckViewSmall"

@observer
export class DecksPageComponent extends React.Component {

    render() {
        const {deckPage, addingMoreDecks, searchingForDecks, moreDecksAvailable, showMoreDecks} = DeckStore.instance

        let decksToDisplay = null
        if (deckPage != null) {
            if (deckPage.decks.length === 0) {
                decksToDisplay = (
                    <Typography variant={"h6"} color={"secondary"} style={{marginTop: spacing(4)}}>
                        Sorry, no decks match your search criteria.
                    </Typography>
                )
            } else {
                decksToDisplay = (
                    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                        {deckPage.decks.map((deck) => (
                            <DeckViewSmall key={deck.id} deck={deck}/>
                        ))}
                    </div>
                )
            }
        }

        let showMoreButton = null
        if (moreDecksAvailable()) {
            showMoreButton = (
                <KeyButton
                    disabled={addingMoreDecks}
                    loading={addingMoreDecks}
                    onClick={showMoreDecks}
                    variant={"outlined"}
                >
                    Show more
                </KeyButton>
            )
        }

        return (
            <KeyTopbar name={"Decks of Keyforge"} shortName={"Decks"} subheader={"Search, evaluate, sell and trade"}>
                <div style={{display: "flex"}}>
                    <DecksSearchDrawer/>
                    <div
                        style={{
                            flexGrow: 1,
                            margin: spacing(2),
                        }}
                    >
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                            {decksToDisplay}
                            {showMoreButton}
                            <Loader show={searchingForDecks}/>
                        </div>
                    </div>
                </div>
            </KeyTopbar>
        )
    }
}