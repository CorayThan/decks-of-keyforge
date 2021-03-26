import { Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { TCOIcon } from "../generic/icons/TCOIcon"

export const TcoUser = (props: { tcoUsername?: string, style?: React.CSSProperties }) => {
    if (props.tcoUsername == null) {
        return null
    }
    return (
        <div style={{display: "flex", alignItems: "center", ...props.style}}>
            <TCOIcon style={{marginRight: spacing(1)}}/>
            <Typography variant={"body1"}>{props.tcoUsername}</Typography>
        </div>
    )
}