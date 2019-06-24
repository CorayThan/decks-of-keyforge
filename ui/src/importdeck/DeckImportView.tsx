import { Typography } from "@material-ui/core"
import { DropzoneArea } from "material-ui-dropzone"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { ExpansionSelector, SelectedExpansion } from "../expansions/ExpansionSelector"
import { KeyButton } from "../mui-restyled/KeyButton"
import { screenStore } from "../ui/ScreenStore"
import { uiStore } from "../ui/UiStore"
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

    handleImageAdded = (files: File[]) => {
        deckImportViewStore.deckImage = files[0]
    }

    postDeckImage = () => {
        const expansionNumber = this.expansionStore.expansionNumber()
        if (deckImportViewStore.deckImage && expansionNumber) {
            deckImportStore.readImageIntoDeck(deckImportViewStore.deckImage, expansionNumber)
        }
    }

    render() {
        return (
            <div style={{margin: spacing(4), justifyContent: "center", display: "flex", flexWrap: "wrap"}}>
                <div>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Import Deck</Typography>
                    {saveUnregisteredDeckStore.currentDeck ? null : (
                        <>
                            <ExpansionSelector store={this.expansionStore} style={{marginBottom: spacing(2), width: 200}}/>
                            <div style={{display: "flex", alignItems: "center", height: 250}}>
                                <div style={{width: 200, height: 250}}>
                                    <DropzoneArea
                                        onChange={this.handleImageAdded.bind(this)}
                                        filesLimit={1}
                                        dropzoneText={"Upload a deck list image"}
                                        acceptedFiles={["image/*"]}
                                        // 3MB
                                        maxFileSize={3145728}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: 212,
                                        paddingLeft: spacing(2),
                                        paddingRight: spacing(2),
                                        height: "100%",
                                    }}
                                >
                                    <Typography variant={"body2"}>
                                        Use a picture taken straight on with low glare and clear text. 1mb or less in size is best, but it must be less than
                                        3mb.
                                        Setting your phone camera to the lowest quality setting is often best. Leave about 1/4 inch around the edges after
                                        cropping it.
                                    </Typography>
                                    <KeyButton
                                        disabled={
                                            !deckImportViewStore.deckImage
                                            || deckImportStore.readingDeckImage
                                            || !cardStore.cardNameLowercaseToCard
                                            || !!saveUnregisteredDeckStore.currentDeck
                                            || this.expansionStore.expansionNumber() == null
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
                                </div>
                            </div>
                        </>
                    )}
                    {deckImportViewStore.deckImage ? (
                        <div style={{paddingTop: spacing(2)}}>
                            <img
                                style={{
                                    marginTop: spacing(4),
                                    width: screenStore.screenSizeXs() ? 200 : 400,
                                }}
                                src={URL.createObjectURL(deckImportViewStore.deckImage)}
                            />
                        </div>
                    ) : null}
                </div>
                {deckImportStore.readDeck ? <CreateUnregisteredDeck initialDeck={deckImportStore.readDeck}/> : null}
            </div>
        )
    }
}
