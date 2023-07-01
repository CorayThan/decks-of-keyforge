import { KeyLink } from "../../mui-restyled/KeyLink"
import Typography from "@material-ui/core/Typography/Typography"
import * as React from "react"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { Routes } from "../../config/Routes"
import { DeckType } from "../../generated-src/DeckType"

export const DeckViewDeckName = (props: {
    deck: DeckSearchResult,
    fake: boolean,
    fullVersion: boolean,
}) => {
    const {deck, fake, fullVersion} = props

    let link
    if (deck.deckType === DeckType.ALLIANCE) {
        link = Routes.allianceDeckPage(deck.keyforgeId)
    } else if (fake) {
        link = Routes.theoreticalDeckPage(deck.keyforgeId)
    } else {
        link = Routes.deckPage(deck.keyforgeId)
    }

    return (
        <KeyLink
            to={link}
            disabled={fullVersion}
            noStyle={true}
        >
            <Typography
                variant={"h5"}
                style={{color: "#FFF", fontSize: "1.75rem"}}
            >
                {deck.name}
            </Typography>
        </KeyLink>
    )
}
