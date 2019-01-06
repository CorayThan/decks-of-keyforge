import { Button, Popover, TextField } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { Redirect } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { KeyButton } from "../mui-restyled/KeyButton"
import { DeckStore } from "./DeckStore"

@observer
export class DeckImportPop extends React.Component<{ style?: React.CSSProperties }> {

    @observable
    popOpen = false
    anchorElement?: HTMLDivElement

    @observable
    deckId = ""

    componentDidMount() {
        DeckStore.instance.importedDeck = false
        DeckStore.instance.importingDeck = false
        this.deckId = ""
        this.popOpen = false
    }

    import = () => {
        DeckStore.instance.importDeck(this.deckId)
    }

    handlePopoverOpen = (event: React.MouseEvent<HTMLInputElement>) => {
        this.popOpen = true
    }

    handlePopoverClose = () => {
        this.popOpen = false
    }

    render() {

        if (DeckStore.instance.importedDeck) {
            return <Redirect to={Routes.deckPage(this.deckId)}/>
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
                    open={this.popOpen}
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
                            label={"Keyforge Deck Id"}
                            value={this.deckId}
                            onChange={(event) => this.deckId = event.target.value}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                            helperText={"Id from the deck url at keyforgegame.com e.g. 293f366d-af1d-46ea-9c0f-4cc956dae50d"}
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
