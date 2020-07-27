import { IconButton } from "@material-ui/core"
import Menu from "@material-ui/core/Menu"
import { MoreVert } from "@material-ui/icons"
import * as React from "react"
import { ReportPurchaseButton } from "../../auctions/purchases/ReportPurchaseButton"
import { CardsForDeck } from "../../cards/CardsForDeck"
import { ToggleDeckNotesMenuItem } from "../../notes/DeckNote"
import { userStore } from "../../user/UserStore"
import { deckStore } from "../DeckStore"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { DeckActionClickable } from "./DeckActionClickable"
import { MyDecksButton } from "./MyDecksButton"

export const MoreDeckActions = (props: { deck: DeckSearchResult, compact: boolean }) => {
    const {deck, compact} = props

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <IconButton aria-controls="more-deck-actions-menu" aria-haspopup="true" onClick={handleClick} style={{margin: 0}}>
                <MoreVert/>
            </IconButton>
            <Menu
                id={"more-deck-actions-menu"}
                anchorEl={anchorEl}
                keepMounted={true}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {compact ? <MyDecksButton deck={deck} menuItem={true}/> : null}
                <ReportPurchaseButton deckId={deck.id} deckName={deck.name} onClick={handleClose}/>
                <CardsForDeck cards={deck.housesAndCards} deckName={deck.name} onClick={handleClose}/>
                <ToggleDeckNotesMenuItem onClick={handleClose}/>
                {userStore.loggedIn() && deck.registered && (
                    <DeckActionClickable
                        onClick={() => {
                            handleClose()
                            deckStore.refreshDeckScores(deck.keyforgeId)
                        }}
                        menuItem={true}
                    >
                        Refresh MV Wins
                    </DeckActionClickable>
                )}
            </Menu>
        </>
    )
}
