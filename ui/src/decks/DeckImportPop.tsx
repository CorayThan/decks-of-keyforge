import { Button, Popover, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { KeyButton } from "../mui-restyled/KeyButton"
import { DeckStore } from "./DeckStore"

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
        DeckStore.instance.importedDeck = false
        DeckStore.instance.importingDeck = false
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
        DeckStore.instance.importDeck(importWith)
    }

    deckIdFromUserInput = (): string => {
        const splitOnSlash = this.deckId.split("/")
        return splitOnSlash[splitOnSlash.length - 1]
    }
    handlePopoverOpen = (event: React.MouseEvent<HTMLInputElement>) => {
        deckImportPopStore.popOpen = true
        this.deckId = ""
    }

    handlePopoverClose = () => {
        deckImportPopStore.popOpen = false
    }

    render() {

        if (DeckStore.instance.importedDeck) {
            return <Redirect to={Routes.deckPage(this.deckIdFromUserInput())}/>
        }

        return (
            <div style={this.props.style}>
                <div
                    ref={(ref: HTMLDivElement) => this.anchorElement = ref}
                >
                    <KeyButton
                        color={"inherit"}
                        onClick={this.handlePopoverOpen}
                    >
                        Import Deck
                    </KeyButton>
                </div>
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
                    style={{zIndex: 12000}}
                >
                    <div style={{padding: spacing(2), display: "flex", flexDirection: "column"}}>
                        <TextField
                            variant={"outlined"}
                            label={"Keyforge Deck Id or URL"}
                            value={this.deckId}
                            onChange={(event) => this.deckId = event.target.value}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                            helperText={"Id or Url from the deck url at keyforgegame.com e.g. 293f366d-af1d-46ea-9c0f-4cc956dae50d"}
                            error={this.error}
                        />
                        <div style={{display: "flex"}}>
                            <div style={{flexGrow: 1}}/>
                            <Button
                                variant={"outlined"}
                                style={{marginRight: spacing(2)}}
                                onClick={this.handlePopoverClose}
                            >
                                Cancel
                            </Button>
                            <KeyButton
                                variant={"contained"}
                                color={"primary"}
                                onClick={this.import}
                                loading={DeckStore.instance.importingDeck}
                            >
                                Import Deck
                            </KeyButton>
                        </div>
                    </div>
                </Popover>
            </div>
        )
    }
}
