import { Tooltip, Typography } from "@material-ui/core"
import { amber, blue, teal } from "@material-ui/core/colors"
import Home from "@material-ui/icons/Home"
import { startCase } from "lodash"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { AntiIcon } from "../generic/icons/AntiIcon"
import { SynergyEffectIcon } from "../generic/icons/SynergyEffectIcon"

export const TraitBubble = (props: { name: string, positive: boolean, home?: boolean, noHome?: boolean, trait?: boolean, rating?: number }) => {
    const color = props.positive && !props.trait ? "#FFFFFF" : undefined
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
                backgroundColor: props.trait ? teal.A400 : (props.positive ? blue.A400 : amber.A400),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: spacing(1),
                paddingLeft: spacing(2),
                paddingRight: spacing(2),
                margin: 4,
            }}
        >
            {props.rating ? (
                <SynergyEffectIcon effect={props.rating}/>
            ) : null}
            {props.home ? (
                <Tooltip title={"Synergizes with house traits only"}>
                    <Home style={{color, marginRight: spacing(1)}}/>
                </Tooltip>
            ) : null}
            {props.noHome ? (
                <Tooltip title={"Synergizes with out of house traits only"}>
                    <div style={{width: 36, height: 36, marginLeft: spacing(1), marginRight: spacing(1)}}>
                        <div style={{position: "absolute", paddingLeft: 7, paddingTop: 5}}>
                            <Home style={{color,}}/>
                        </div>
                        <AntiIcon style={{position: "absolute"}}/>
                    </div>
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
