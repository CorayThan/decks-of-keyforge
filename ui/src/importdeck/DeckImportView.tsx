import { Button, Paper, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { ExpansionSelector, SelectedExpansion } from "../expansions/ExpansionSelector"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
import { userStore } from "../user/UserStore"
import { CreateUnregisteredDeck, saveUnregisteredDeckStore } from "./CreateUnregisteredDeck"
import { deckImportStore } from "./DeckImportStore"

class DeckImportViewStore {
    @observable
    deckImage?: File
}

export const deckImportViewStore = new DeckImportViewStore()

@observer
export class DeckImportView extends React.Component {

    expansionStore = new SelectedExpansion()

    constructor(props: {}) {
        super(props)
        uiStore.setTopbarValues("Import Deck", "Import", "Add unregistered decks to evaluate, sell, and trade")
    }

    componentDidMount(): void {
        deckImportViewStore.deckImage = undefined
        saveUnregisteredDeckStore.currentDeck = undefined
        deckImportStore.readDeck = undefined
        deckImportStore.newDeckId = undefined
        deckImportStore.startMessages()
        this.expansionStore = new SelectedExpansion()
    }

    componentWillUnmount(): void {
        deckImportViewStore.deckImage = undefined
        saveUnregisteredDeckStore.currentDeck = undefined
        deckImportStore.readDeck = undefined
        deckImportStore.newDeckId = undefined
        deckImportStore.stopMessages()
    }

    handleImageAdded = (event: React.ChangeEvent<HTMLInputElement>) => {
        deckImportViewStore.deckImage = event.target.files![0]
    }

    postDeckImage = () => {
        const expansionNumber = this.expansionStore.currentExpansion()
        if (deckImportViewStore.deckImage && expansionNumber) {
            deckImportStore.readImageIntoDeck(deckImportViewStore.deckImage, expansionNumber)
        }
    }

    render() {

        if (!userStore.theoreticalDecksAllowed) {
            return <Typography>Please become a patron to import unregistered decks.</Typography>
        }

        // @ts-ignore
        return (
            <div style={{margin: spacing(4), justifyContent: "center", display: "flex", flexWrap: "wrap"}}>
                <div>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Import Deck</Typography>
                    <Paper style={{padding: spacing(2), maxWidth: 600}}>
                        {saveUnregisteredDeckStore.currentDeck ? null : (
                            <>
                                <ExpansionSelector store={this.expansionStore} style={{marginBottom: spacing(2), width: 200}}/>
                                <div style={{marginBottom: spacing(2)}}>
                                    <input
                                        accept="image/*"
                                        style={{display: "none"}}
                                        id="contained-button-file"
                                        multiple={false}
                                        type="file"
                                        onChange={this.handleImageAdded.bind(this)}
                                    />
                                    <label htmlFor="contained-button-file">
                                        {/*@ts-ignore*/}
                                        <Button variant="contained" component={"span"} color={"primary"}>
                                            Upload a deck list image
                                        </Button>
                                    </label>
                                </div>
                                <Typography variant={"body2"} style={{marginBottom: spacing(1)}}>
                                    Unregistered decks cannot be listed for sale. Please register your deck on Master Vault to sell it.
                                </Typography>
                                <Typography variant={"body2"}>
                                    Use a picture taken straight on with low glare and clear text. 500kb or less in size is best. The larger the image the less
                                    likely it will successfully scan. Images above 3mb will not be accepted.
                                    Setting your phone camera to the lowest quality setting is often best. Leave about 1/4 inch around the edges after
                                    cropping it.
                                </Typography>
                                <KeyButton
                                    disabled={
                                        !deckImportViewStore.deckImage
                                        || deckImportStore.readingDeckImage
                                        || !cardStore.cardsLoaded
                                        || !!saveUnregisteredDeckStore.currentDeck
                                        || this.expansionStore.currentExpansion() == null
                                    }
                                    variant={"contained"}
                                    color={"primary"}
                                    loading={deckImportStore.readingDeckImage}
                                    style={{marginTop: spacing(2), marginBottom: spacing(2)}}
                                    onClick={this.postDeckImage}
                                >
                                    Read Deck List
                                </KeyButton>
                                {deckImportStore.readingDeckMessage ? (
                                    <Typography variant={"body2"}>{deckImportStore.readingDeckMessage}</Typography>
                                ) : null}
                            </>
                        )}
                        {deckImportViewStore.deckImage ? (
                            <div style={{paddingTop: spacing(2)}}>
                                <img
                                    alt={"Deck"}
                                    style={{
                                        width: screenStore.screenSizeXs() ? 200 : 400,
                                    }}
                                    src={URL.createObjectURL(deckImportViewStore.deckImage)}
                                />
                            </div>
                        ) : null}
                    </Paper>
                </div>
                {deckImportStore.readDeck ? <CreateUnregisteredDeck initialDeck={deckImportStore.readDeck} expansion={this.expansionStore.currentExpansion()!}/> : null}
            </div>
        )
    }
}
