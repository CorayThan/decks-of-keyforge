import { Box, Button, ListItem, ListItemText, Popover, TextField, Tooltip, Typography } from "@material-ui/core"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { closeAllMenuStoresExcept } from "../components/KeyTopbar"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { deckStore } from "../decks/DeckStore"

class DeckImportPopStore {
    @observable
    popOpen = false

    constructor() {
        makeObservable(this)
    }
}

export const deckImportPopStore = new DeckImportPopStore()

@observer
export class DeckImportPop extends React.Component<{ style?: React.CSSProperties }> {
    anchorElement?: HTMLDivElement

    @observable
    deckId = ""

    @observable
    error = false

    constructor(props: { style?: React.CSSProperties }) {
        super(props)
        makeObservable(this)
    }

    componentDidMount() {
        deckStore.importedDeck = false
        deckStore.importingDeck = false
        this.deckId = ""
        deckImportPopStore.popOpen = false
        this.error = false
    }

    import = () => {
        this.error = false
        const importWith = Utils.findUuid(this.deckId)
        if (importWith.length !== 36) {
            this.error = true
            return
        }
        deckStore.importDeck(importWith)
    }

    importAndAdd = () => {
        this.error = false
        const importWith = Utils.findUuid(this.deckId)
        if (importWith.length !== 36) {
            this.error = true
            return
        }
        deckStore.importDeckAndAddToMyDecks(importWith)
    }

    handlePopoverOpen = () => {
        deckImportPopStore.popOpen = true
        this.deckId = ""
    }

    handlePopoverClose = () => {
        deckImportPopStore.popOpen = false
        closeAllMenuStoresExcept()
    }

    render() {

        if (deckStore.importedDeck) {
            return <Redirect to={Routes.deckPage(Utils.findUuid(this.deckId))}/>
        }

        return (
            <>
                <ListItem
                    style={this.props.style}
                    ref={(ref: HTMLDivElement) => this.anchorElement = ref}
                    button={true}
                    color={"inherit"}
                    onClick={this.handlePopoverOpen}
                >
                    <ListItemText primary={"Import Deck"}/>
                </ListItem>
                <Popover
                    open={deckImportPopStore.popOpen}
                    onClose={this.handlePopoverClose}
                    anchorEl={this.anchorElement}
                    anchorPosition={{top: 500, left: 400}}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    style={{zIndex: screenStore.zindexes.menuPops}}
                >
                    <div style={{padding: spacing(2), display: "flex", flexDirection: "column", maxWidth: 600}}>
                        <Typography variant={"body2"} color={"textSecondary"} noWrap={false}
                                    style={{marginBottom: spacing(2)}}>
                            If this feature doesn't work, please try again later.
                        </Typography>
                        <TextField
                            variant={"outlined"}
                            label={"KeyForge Deck Id or URL"}
                            value={this.deckId}
                            onChange={(event) => this.deckId = event.target.value}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                            helperText={"Id or Url from the deck url at keyforgegame.com e.g. 293f366d-af1d-46ea-9c0f-4cc956dae50d"}
                            error={this.error}
                        />
                        <Box display={"flex"} alignItems={"center"} mb={2}>
                            <Tooltip
                                title={userStore.theoreticalDecksAllowed ? "" : "Become a $3 a month patron to create theoretical decks!"}
                                style={{zIndex: screenStore.zindexes.tooltip}}
                            >
                                <LinkButton
                                    href={Routes.createTheoreticalDeck}
                                    onClick={() => {
                                        closeAllMenuStoresExcept()
                                        deckImportPopStore.popOpen = false
                                    }}
                                    style={{marginRight: spacing(2)}}
                                    disabled={!userStore.theoreticalDecksAllowed}
                                >
                                    Create Theoretical Deck
                                </LinkButton>
                            </Tooltip>
                            <Box flexGrow={1}/>
                            <LinkButton
                                onClick={() => {
                                    closeAllMenuStoresExcept()
                                    deckImportPopStore.popOpen = false
                                }}
                                href={Routes.importDecks}
                            >
                                Deck Import Page
                            </LinkButton>
                        </Box>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Button
                                variant={"outlined"}
                                style={{marginRight: spacing(2)}}
                                onClick={this.handlePopoverClose}
                            >
                                Cancel
                            </Button>
                            <div style={{flexGrow: 1}}/>
                            <KeyButton
                                variant={"contained"}
                                onClick={this.import}
                                loading={deckStore.importingDeck}
                            >
                                Import
                            </KeyButton>
                            {userStore.loggedIn() ? (
                                <KeyButton
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={this.importAndAdd}
                                    loading={deckStore.importingAndAddingDeck}
                                    style={{marginLeft: spacing(2)}}
                                >
                                    Import to my Decks
                                </KeyButton>
                            ) : null}
                        </div>
                    </div>
                </Popover>
            </>
        )
    }
}
