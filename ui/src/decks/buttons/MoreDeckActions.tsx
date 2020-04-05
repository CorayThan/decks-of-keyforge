import { IconButton } from "@material-ui/core"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { MoreVert } from "@material-ui/icons"
import * as React from "react"
import { ReportPurchaseButton } from "../../auctions/purchases/ReportPurchaseButton"
import { CardsForDeck } from "../../cards/CardsForDeck"
import { userStore } from "../../user/UserStore"
import { DeckNote } from "../../userdeck/DeckNote"
import { Deck } from "../Deck"
import { deckStore } from "../DeckStore"
import { DeckActionClickable } from "./DeckActionClickable"
import { MyDecksButton } from "./MyDecksButton"

export const MoreDeckActions = (props: { deck: Deck, compact: boolean }) => {
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
            <IconButton aria-controls="more-deck-actions-menu" aria-haspopup="true" onClick={handleClick}>
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
                <CardsForDeck cards={deck.searchResultCards} deckName={deck.name} onClick={handleClose}/>
                <DeckNote id={deck.id} name={deck.name} onClick={handleClose}/>
                {deck.registered && (
                    <MenuItem
                        component={"a"}
                        href={"https://www.keyforgegame.com/deck-details/" + deck.keyforgeId}
                    >
                        Master Vault
                    </MenuItem>
                )}
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
