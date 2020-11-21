import { Box, Grid, Tooltip, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { useEffect } from "react"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { DeckViewSmall } from "../../decks/DeckViewSmall"
import { LinkButton } from "../../mui-restyled/LinkButton"
import { Loader } from "../../mui-restyled/Loader"
import { uiStore } from "../../ui/UiStore"
import { userStore } from "../../user/UserStore"
import { theoreticalDeckStore } from "./TheoreticalDeckStore"

export const ViewMyTheoreticalDecks = observer(() => {

    useEffect(() => {
        theoreticalDeckStore.findMyTheoreticalDecks()
        uiStore.setTopbarValues("My Theories", "Theories", "Unregistered decks you've created")
    }, [])

    const theoryDecks = theoreticalDeckStore.myTheoryDecks

    if (theoryDecks == null) {
        return <Loader/>
    }

    if (theoryDecks.length === 0) {
        return (
            <Box display={"flex"} alignItems={"center"} flexDirection={"column"} m={4}>
                <img
                    style={{width: 232}}
                    src={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/master-the-theory.png"}
                    alt={"Card"}
                />
                <Typography style={{marginTop: spacing(2)}}>You don't have any previously created theoretical decks yet!</Typography>
                <Tooltip
                    title={userStore.theoreticalDecksAllowed ? "" : "Become a $3 a month patron to create theoretical decks!"}
                >
                    <div>
                        <LinkButton
                            href={Routes.createTheoreticalDeck}
                            color={"primary"}
                            style={{marginTop: spacing(2)}}
                            disabled={!userStore.theoreticalDecksAllowed}
                        >
                            Make One
                        </LinkButton>
                    </div>
                </Tooltip>
            </Box>
        )
    }

    return (
        <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
            <Tooltip
                title={userStore.theoreticalDecksAllowed ? "" : "Become a $3 a month patron to create theoretical decks!"}
            >
                <div>
                    <LinkButton
                        href={Routes.createTheoreticalDeck}
                        variant={"outlined"}
                        color={"primary"}
                        style={{marginTop: spacing(2), marginBottom: spacing(2)}}
                        disabled={!userStore.theoreticalDecksAllowed}
                    >
                        Create Theoretical Deck
                    </LinkButton>
                </div>
            </Tooltip>
            <Grid container={true} spacing={2} justify={"center"}>
                {theoryDecks.map(theoryDeck => (
                    <Grid item={true} key={theoryDeck.deck.keyforgeId}>
                        <DeckViewSmall deck={theoryDeck.deck} fake={true} style={{margin: 0}}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
})
