import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core"
import { GetApp } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React, { useEffect, useState } from "react"
import { spacing } from "../../config/MuiConfig"
import { PatreonRewardsTier } from "../../generated-src/PatreonRewardsTier"
import { CsvDownloadButton } from "../../generic/CsvDownloadButton"
import { HelperText } from "../../generic/CustomTypographies"
import { KeyButton } from "../../mui-restyled/KeyButton"
import { PatronButton } from "../../thirdpartysites/patreon/PatronButton"
import { userStore } from "../../user/UserStore"
import { deckStore } from "../DeckStore"
import { DeckUtils } from "../models/DeckSearchResult"
import { DeckFilters } from "./DeckFilters"

class DownloadDeckResultsStore {
    @observable
    open = false
    @observable
    loading1000 = false
    @observable
    loading5000 = false

    reset = () => {
        deckStore.decksToDownload = undefined
        deckStore.downloadingDecks = false
        this.loading1000 = false
        this.loading5000 = false
        this.open = false
    }
}

export const DownloadDeckResults = observer((props: { filters: DeckFilters }) => {

    const [store] = useState(new DownloadDeckResultsStore())

    useEffect(() => {
        return store.reset
    }, [])

    return (
        <>
            <IconButton
                size={"small"}
                style={{marginLeft: spacing(2), marginTop: "auto"}}
                onClick={() => store.open = true}
            >
                <GetApp/>
            </IconButton>
            {store.open && (
                <Dialog
                    open={store.open}
                    onClose={store.reset}
                >
                    <DialogTitle>Download Decks Spreadsheet</DialogTitle>
                    <DialogContent>
                        <HelperText style={{marginBottom: spacing(2)}}>
                            Click download to download the decks currently loaded. $6+ per month Patrons can load the first 1,000 or
                            5,000 results that match their query. Please be patient and do not trigger multiple downloads at the same time.
                        </HelperText>
                        <KeyButton
                            variant={"outlined"}
                            color={"primary"}
                            style={{marginRight: spacing(2)}}
                            disabled={!userStore.patron || deckStore.downloadingDecks || store.loading1000}
                            loading={deckStore.downloadingDecks && store.loading1000}
                            onClick={() => {
                                store.loading1000 = true
                                store.loading5000 = false
                                deckStore.findDecksToDownload(props.filters, 1000)
                            }}
                        >
                            Load 1,000 Decks
                        </KeyButton>
                        <KeyButton
                            variant={"outlined"}
                            color={"primary"}
                            disabled={!userStore.patron || deckStore.downloadingDecks || store.loading5000}
                            loading={deckStore.downloadingDecks && store.loading5000}
                            onClick={() => {
                                store.loading1000 = false
                                store.loading5000 = true
                                deckStore.findDecksToDownload(props.filters, 5000)
                            }}
                            style={{flexGrow: 1}}
                        >
                            Load 5,000 Decks
                        </KeyButton>
                        {!userStore.patronLevelEqualToOrHigher(PatreonRewardsTier.SUPPORT_SOPHISTICATION) && (
                            <PatronButton style={{marginTop: spacing(2)}}/>
                        )}
                        {deckStore.decksToDownload != null && (
                            <Typography variant={"body2"} style={{marginTop: spacing(2)}}>
                                Ready to download...
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={store.reset}>
                            Close
                        </Button>
                        <CsvDownloadButton
                            name={"decks"}
                            data={DeckUtils.arrayToCSV(
                                (deckStore.decksToDownload ?? (deckStore.decksToDisplay ?? [])
                                    .map(deckId => deckStore.deckIdToDeck?.get(deckId)!)
                                    .filter(deck => deck != null))
                            )}
                            button={(
                                <KeyButton
                                    color={"primary"}
                                    onClick={() => store.open = false}
                                    disabled={deckStore.downloadingDecks}
                                >
                                    Download
                                </KeyButton>
                            )}
                        />
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
})
