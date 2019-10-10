import { Button, ListItem, ListItemText, Popover, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { deckStore } from "./DeckStore"

class DeckImportPopStore {
    @observable
    popOpen = false
}

export const deckImportPopStore = new DeckImportPopStore()

@observer
export class DeckImportPop extends React.Component<{ style?: React.CSSProperties }> {

    anchorElement?: HTMLDivElement

    @observable
    deckId = ""

    @observable
    error = false

    componentDidMount() {
        deckStore.importedDeck = false
        deckStore.importingDeck = false
        this.deckId = ""
        deckImportPopStore.popOpen = false
        this.error = false
    }

    import = () => {
        this.error = false
        const importWith = this.deckIdFromUserInput()
        if (importWith.length !== 36) {
            this.error = true
            return
        }
        deckStore.importDeck(importWith)
    }

    importAndAdd = () => {
        this.error = false
        const importWith = this.deckIdFromUserInput()
        if (importWith.length !== 36) {
            this.error = true
            return
        }
        deckStore.importDeckAndAddToMyDecks(importWith)
    }

    deckIdFromUserInput = (): string => {
        const splitOnSlash = this.deckId.split("/")
        return splitOnSlash[splitOnSlash.length - 1]
    }
    handlePopoverOpen = () => {
        deckImportPopStore.popOpen = true
        this.deckId = ""
    }

    handlePopoverClose = () => {
        deckImportPopStore.popOpen = false
    }

    render() {

        if (deckStore.importedDeck) {
            return <Redirect to={Routes.deckPage(this.deckIdFromUserInput())}/>
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
                    <div style={{padding: spacing(2), display: "flex", flexDirection: "column"}}>
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
                        <div
                            style={{marginBottom: spacing(2), display: "flex"}}
                        >
                            {userStore.loggedIn() ? (
                                <LinkButton
                                    to={Routes.importUnregisteredDeck}
                                    color={"primary"}
                                    onClick={() => deckImportPopStore.popOpen = false}
                                >
                                    Import Unregistered Deck
                                </LinkButton>
                            ) : (
                                <Typography>Login to import unregistered decks</Typography>
                            )}
                        </div>
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
