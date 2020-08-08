import { Paper, Typography } from "@material-ui/core"
import React from "react"
import { spacing } from "../config/MuiConfig"

export const CodeOfConduct = () => {

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{maxWidth: 600}}>
                <Paper style={{margin: spacing(4), marginTop: spacing(2), padding: spacing(4)}}>
                    <Typography variant={"h6"} style={{fontWeight: 700}}>
                        CODE OF CONDUCT
                    </Typography>
                    <ConductText>
                        Only mark decks you own as owned.
                    </ConductText>
                    <ConductText>
                        Only sell decks for which you have the Archon card and all associated cards, in playable or better condition.
                    </ConductText>
                    <ConductText>
                        Do not place bids or make offers on decks you are selling. Do not do so on
                        behalf of another seller.
                    </ConductText>
                    <ConductText>
                        Only upload ownership verification photos for decks you personally own, or at the express request of the owner.
                    </ConductText>
                </Paper>
            </div>
        </div>
    )
}

const ConductText = (props: { children: string }) => {
    return (
        <Typography variant={"body1"} style={{marginTop: spacing(2)}}>
            {props.children}
        </Typography>
    )
}
