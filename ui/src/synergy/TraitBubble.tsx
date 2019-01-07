import { Tooltip, Typography } from "@material-ui/core"
import { amber, blue } from "@material-ui/core/colors"
import HomeIcon from "@material-ui/icons/Home"
import { startCase } from "lodash"
import * as React from "react"
import { spacing } from "../config/MuiConfig"


export const TraitBubble = (props: { name: string, positive: boolean, home?: boolean, trait?: boolean }) => {
    const color = props.positive ? "#FFFFFF" : undefined
    let title
    if (props.trait) {
        title = "Trait"
    } else if (props.positive) {
        title = "Synergy"
    } else {
        title = "Antisynergy"
    }
    return (
        <span
            style={{
                borderRadius: 20,
                backgroundColor: props.positive ? blue.A400 : amber.A400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: spacing(1),
                paddingLeft: spacing(2),
                paddingRight: spacing(2),
                margin: 4,
            }}
        >
        {props.home ? (
            <Tooltip title={"Synergizes with house traits only"}>
                <HomeIcon style={{color, marginRight: spacing(1)}}/>
            </Tooltip>
        ) : null}
        <Tooltip title={title}>
            <Typography variant={"body2"} style={{fontSize: "0.8125rem", color}}>
            {startCase(props.name)}
        </Typography>
        </Tooltip>
    </span>
    )
}
