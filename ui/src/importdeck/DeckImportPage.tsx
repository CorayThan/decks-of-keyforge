import { Box, Card, TextField, Tooltip, Typography } from "@material-ui/core"
import * as React from "react"
import { useEffect, useState } from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { Utils } from "../config/Utils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { userStore } from "../user/UserStore"
import { uiStore } from "../ui/UiStore"
import { deckStore } from "../decks/DeckStore"
import { observer } from "mobx-react"
import { DeckViewSmall } from "../decks/DeckViewSmall"

export const DeckImportPage = observer(() => {

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingMine, setLoadingMine] = useState(false)
    const [deckId, setDeckId] = useState("")

    const importDeck = async () => {
        setError(false)
        setLoading(true)
        const importWith = Utils.findUuid(deckId)
        if (importWith.length !== 36) {
            setError(true)
            setLoading(false)
            return
        }
        await deckStore.importDeck(importWith)
        await deckStore.findDeckForImportPage(importWith)
        setLoading(false)
    }

    const importAndAdd = async () => {
        setError(false)
        setLoadingMine(true)
        const importWith = Utils.findUuid(deckId)
        if (importWith.length !== 36) {
            setError(true)
            setLoadingMine(false)
            return
        }
        await deckStore.importDeckAndAddToMyDecks(importWith)
        await deckStore.findDeckForImportPage(importWith)
        setLoadingMine(false)
    }

    useEffect(() => {
        uiStore.setTopbarValues("Import Decks", "Import", "Add decks to the site")
        deckStore.importDecksPageDeck = undefined
        return () => {
            deckStore.importDecksPageDeck = undefined
        }
    }, [])

    const smallScreen = screenStore.screenSizeSm()

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={smallScreen && "center"} flexDirection={smallScreen ? "column" : "row"}>
            <Box maxWidth={600} m={2}>
                <Card>
                    <Box m={2}>
                        <Typography
                            variant={"body2"} color={"textSecondary"}
                            noWrap={false}
                            style={{marginBottom: spacing(2)}}
                        >
                            Decks are imported to the site approximately every two minutes, although the automatic
                            process can fall behind if many decks are available at once. You can manually import
                            decks here to see scores for decks earlier, or to add them to your collection.
                        </Typography>
                        <Typography
                            variant={"body2"} color={"textSecondary"}
                            noWrap={false}
                            style={{marginBottom: spacing(2)}}
                        >
                            If this feature doesn't work, please try again later.
                        </Typography>
                        <TextField
                            variant={"outlined"}
                            label={"KeyForge Deck Id or URL"}
                            value={deckId}
                            onChange={(event) => setDeckId(event.target.value)}
                            style={{marginBottom: spacing(2)}}
                            autoFocus={true}
                            helperText={"Id or Url from the deck url at keyforgegame.com e.g. 293f366d-af1d-46ea-9c0f-4cc956dae50d"}
                            error={error}
                        />
                        <div
                            style={{marginBottom: spacing(2), display: "flex"}}
                        >
                            <Tooltip
                                title={userStore.theoreticalDecksAllowed ? "" : "Become a $3 a month patron to create theoretical decks!"}
                                style={{zIndex: screenStore.zindexes.tooltip}}
                            >
                                <div>
                                    <LinkButton
                                        href={Routes.createTheoreticalDeck}
                                        color={"primary"}
                                        style={{marginRight: spacing(2)}}
                                        disabled={!userStore.theoreticalDecksAllowed}
                                    >
                                        Create Theoretical Deck
                                    </LinkButton>
                                </div>
                            </Tooltip>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <KeyButton
                                variant={"contained"}
                                onClick={importDeck}
                                loading={loading}
                            >
                                Import
                            </KeyButton>
                            {userStore.loggedIn() ? (
                                <KeyButton
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={importAndAdd}
                                    loading={loadingMine}
                                    style={{marginLeft: spacing(2)}}
                                >
                                    Import to my Decks
                                </KeyButton>
                            ) : null}
                        </div>
                    </Box>
                </Card>
            </Box>
            {deckStore.importDecksPageDeck != null && (
                <DeckViewSmall deck={deckStore.importDecksPageDeck}/>
            )}
        </Box>
    )
})
