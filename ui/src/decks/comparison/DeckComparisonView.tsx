import { Box, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Loader } from "../../mui-restyled/Loader"
import { PatronButton } from "../../thirdpartysites/patreon/PatronButton"
import { uiStore } from "../../ui/UiStore"
import { userStore } from "../../user/UserStore"
import { deckStore } from "../DeckStore"
import { DeckViewSmall } from "../DeckViewSmall"
import { DeckComparisonSummary } from "./DeckComparisonSummary"
import { log } from "../../config/Utils"

export const DeckComparisonView = observer(() => {

    const location = useLocation()
    const search = location.search
    useEffect(() => {
        let searchToUse = search
        if (search.startsWith("?")) {
            searchToUse = search.substr(1)
        }
        const queryValues = new URLSearchParams(searchToUse)
        log.info("Searching for comparison decks with values: " + JSON.stringify(queryValues))
        let deckIds: string[] = queryValues.getAll("decks")
        let allianceDeckIds: string[] = queryValues.getAll("allianceDecks")
        deckStore.findComparisonDecks(deckIds, allianceDeckIds)
    }, [search])
    useEffect(() => {
        uiStore.setTopbarValues("Compare Decks", "Compare", "Evaluate decks side by side")
        return () => {
            keyLocalStorage.clearDeckstoCompare()
        }
    }, [])

    const compareDecks = deckStore.compareDecks

    if (compareDecks == null || userStore.loginInProgress) {
        return <Loader/>
    }

    const patron = userStore.patron

    if (!patron) {
        return (
            <Box display={"flex"} justifyContent={"center"} m={2}>
                <Paper style={{padding: spacing(2), background: themeStore.darkBackgroundColor}}>
                    <Typography
                        style={{marginBottom: spacing(2)}}
                    >
                        Please become a patron to compare decks!
                    </Typography>
                    <PatronButton/>
                </Paper>
            </Box>
        )
    }

    return (
        <Box display={"flex"} justifyContent={"center"}>
            <Box display={"flex"} style={{overflowX: "auto"}}>
                {compareDecks.map(comparison => (
                    <div key={comparison.deck.id}>
                        <DeckComparisonSummary results={comparison.values}/>
                        <Box mb={2}/>
                        <DeckViewSmall deck={comparison.deck} margin={spacing(1)}/>
                    </div>
                ))}
            </Box>
        </Box>
    )
})
