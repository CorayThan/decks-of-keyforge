import { IconButton, Link } from "@material-ui/core"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { MoreVert } from "@material-ui/icons"
import * as React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { ReportPurchaseButton } from "../../auctions/purchases/ReportPurchaseButton"
import { CardsForDeck } from "../../cards/CardsForDeck"
import { Routes } from "../../config/Routes"
import { PatreonRewardsTier } from "../../generated-src/PatreonRewardsTier"
import { deckBuilderStore } from "../../importdeck/DeckBuilder"
import { ToggleDeckNotesMenuItem } from "../../notes/DeckNote"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../../user/UserStore"
import { userDeckStore } from "../../userdeck/UserDeckStore"
import { deckStore } from "../DeckStore"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { CompareDeckButton } from "./CompareDeckButton"
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

    const location = useLocation()
    const history = useHistory()
    const username = userStore.username

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
                {compact ? <CompareDeckButton deck={deck} menuItem={true} onClick={handleClose}/> : null}
                <ReportPurchaseButton deckId={deck.id} deckName={deck.name} onClick={handleClose}/>
                <CardsForDeck cards={deck.housesAndCards} deckName={deck.name} onClick={handleClose}/>
                <ToggleDeckNotesMenuItem onClick={handleClose}/>
                {userStore.loggedIn() && (
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
                {username != null && location.search.includes(`previousOwner=${username}`) && (
                    <MenuItem
                        onClick={() => {
                            userDeckStore.notPreviouslyOwned(deck.name, deck.id)
                            handleClose()
                        }}
                    >
                        Not Previously Owned
                    </MenuItem>
                )}
                {!screenStore.screenSizeXs() && userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.NOTICE_BARGAINS) && (
                    <MenuItem
                        onClick={() => {
                            deckBuilderStore.buildFromDeck(deck)
                            history.push(Routes.createTheoreticalDeck)
                            handleClose()
                        }}
                    >
                        Theoretical Version
                    </MenuItem>
                )}
                <MenuItem
                    component={Link}
                    href={"https://www.keyforgegame.com/deck-details/" + deck.keyforgeId}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    style={{color: "inherit", textDecoration: "none"}}
                >
                    Master Vault
                </MenuItem>
            </Menu>
        </>
    )
}
