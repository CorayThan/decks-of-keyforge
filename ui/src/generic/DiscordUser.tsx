import { Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { DiscordIcon } from "./icons/DiscordIcon"

export const DiscordUser = (props: { discord?: string, style?: React.CSSProperties }) => {
    if (props.discord == null) {
        return null
    }
    return (
        <div style={{display: "flex", alignItems: "center", ...props.style}}>
            <DiscordIcon style={{marginRight: spacing(1)}}/>
            <Typography variant={"body1"}>{props.discord}</Typography>
        </div>
    )
}