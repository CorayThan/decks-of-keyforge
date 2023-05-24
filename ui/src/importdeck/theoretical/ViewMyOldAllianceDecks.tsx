import {Box, Grid, Typography} from "@material-ui/core"
import {observer} from "mobx-react"
import * as React from "react"
import {useEffect} from "react"
import {spacing} from "../../config/MuiConfig"
import {DeckViewSmall} from "../../decks/DeckViewSmall"
import {Loader} from "../../mui-restyled/Loader"
import {uiStore} from "../../ui/UiStore"
import {theoreticalDeckStore} from "./TheoreticalDeckStore"
import {PatreonRequired} from "../../thirdpartysites/patreon/PatreonRequired";
import {PatreonRewardsTier} from "../../generated-src/PatreonRewardsTier";

export const ViewMyOldAllianceDecks = observer(() => {

    useEffect(() => {
        theoreticalDeckStore.findMyAllianceDecks()
        uiStore.setTopbarValues("My Alliances", "Alliances", "Alliance decks you've created")
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
                    src={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/forging-an-alliance.png"}
                    alt={"Card"}
                />
                <Typography style={{marginTop: spacing(2)}}>
                    You haven't created any alliance decks yet! Create them with the toggle at the bottom of the deck
                    search panel.
                </Typography>
                <PatreonRequired
                    requiredLevel={PatreonRewardsTier.NOTICE_BARGAINS}
                    message={"Please become a patron to create alliance decks!"}
                />
            </Box>
        )
    }

    return (
        <Grid container={true} spacing={2} justify={"center"}>
            {theoryDecks.map(theoryDeck => (
                <Grid item={true} key={theoryDeck.deck.keyforgeId}>
                    <DeckViewSmall deck={theoryDeck.deck} fake={true} style={{margin: 0}}/>
                </Grid>
            ))}
        </Grid>
    )
})
