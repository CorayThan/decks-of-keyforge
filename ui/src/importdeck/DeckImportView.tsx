import { Typography } from "@material-ui/core"
import { DropzoneArea } from "material-ui-dropzone"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { KeyButton } from "../mui-restyled/KeyButton"
import { ScreenStore } from "../ui/ScreenStore"
import { CreateUnregisteredDeck, saveUnregisteredDeckStore } from "./CreateUnregisteredDeck"
import { deckImportStore } from "./DeckImportStore"

class DeckImportViewStore {
    @observable
    deckImage?: File
}

export const deckImportViewStore = new DeckImportViewStore()

@observer
export class DeckImportView extends React.Component {

    componentDidMount(): void {
        deckImportViewStore.deckImage = undefined
        saveUnregisteredDeckStore.currentDeck = undefined
        deckImportStore.readDeck = undefined
        deckImportStore.newDeckId = undefined
    }

    handleImageAdded = (files: File[]) => {
        deckImportViewStore.deckImage = files[0]
    }

    postDeckImage = () => {
        if (deckImportViewStore.deckImage) {
            deckImportStore.readImageIntoDeck(deckImportViewStore.deckImage)
        }
    }

    render() {
        return (
            <div style={{margin: spacing(4), justifyContent: "center", display: "flex", flexWrap: "wrap"}}>
                <div>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Deck Image</Typography>
                    {saveUnregisteredDeckStore.currentDeck ? null : (
                        <>
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
                                        justifyContent: "center",
                                    }}
                                >
                                    {deckImportStore.readingDeckMessage ? (
                                        <Typography variant={"body2"}>{deckImportStore.readingDeckMessage}</Typography>
                                    ) : null}
                                    <KeyButton
                                        disabled={
                                            !deckImportViewStore.deckImage
                                            || deckImportStore.readingDeckImage
                                            || !CardStore.instance.cardNameLowercaseToCard
                                            || !!saveUnregisteredDeckStore.currentDeck
                                        }
                                        variant={"contained"}
                                        color={"primary"}
                                        loading={deckImportStore.readingDeckImage}
                                        style={{marginTop: spacing(2), marginBottom: spacing(2)}}
                                        onClick={this.postDeckImage}
                                    >
                                        Read Deck List
                                    </KeyButton>
                                    <Typography variant={"body2"}>
                                        Use a picture taken straight on with low glare and high quality (up to 3MB in size).
                                    </Typography>
                                </div>
                            </div>
                        </>
                    )}
                    {deckImportViewStore.deckImage ? (
                        <div style={{paddingTop: saveUnregisteredDeckStore.currentDeck ? spacing(1) : 0}}>
                            <img
                                style={{
                                    marginTop: spacing(4),
                                    width: ScreenStore.instance.screenSizeXs() ? 200 : 400,
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