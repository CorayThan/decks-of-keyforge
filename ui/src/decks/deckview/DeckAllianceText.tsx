import React from "react"
import { Box } from "@material-ui/core"
import { DeckSearchResult } from "../models/DeckSearchResult"
import { spacing } from "../../config/MuiConfig"
import Typography from "@material-ui/core/Typography/Typography"
import { amber } from "@material-ui/core/colors"
import { DeckType } from "../../generated-src/DeckType"

export const DeckAllianceText = (props: { deck: DeckSearchResult }) => {
    const {deck} = props
    const {deckType, validAlliance} = deck

    if (deckType !== DeckType.ALLIANCE) {
        return null
    }

    return (
        <Box display={"flex"} mb={0.5}>
            {deck.validAlliance === false && (
                <Typography
                    variant={"h5"}
                    color={"secondary"}
                    style={{fontSize: 18, marginRight: spacing(1), fontStyle: "italic"}}
                >

                </Typography>
            )}
            <Typography
                variant={"h5"}
                style={{
                    fontSize: 18,
                    marginRight: spacing(1),
                    fontStyle: "italic",
                    color: validAlliance ?  "#FFFFFF" : amber["400"]
                }}
            >
                {validAlliance ? "" : "Invalid "}Alliance Deck
            </Typography>
        </Box>
    )
}
