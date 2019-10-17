import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { AboveAverageIcon } from "./AboveAverageIcon"
import { AverageIcon } from "./AverageIcon"
import { BelowAverageIcon } from "./BelowAverageIcon"
import { BestIcon } from "./BestIcon"
import { WorstIcon } from "./WorstIcon"

export const CardQualityIcon = (props: { quality: number, style?: React.CSSProperties }) => {
    const quality = props.quality
    if (quality === 0) {
        return <Tooltip title={"AERC 0.5 or less – Worst"}>
            <div style={props.style}><WorstIcon/></div>
        </Tooltip>
    } else if (quality === 1) {
        return <Tooltip title={"AERC 0.5 to 1 – Below Average"}>
            <div style={props.style}><BelowAverageIcon/></div>
        </Tooltip>
    } else if (quality === 2) {
        return <Tooltip title={"AERC 1 to 2 – Average"}>
            <div style={props.style}><AverageIcon/></div>
        </Tooltip>
    } else if (quality === 3) {
        return <Tooltip title={"AERC 2 to 3 – Above Average"}>
            <div style={props.style}><AboveAverageIcon/></div>
        </Tooltip>
    } else if (quality === 4) {
        return <Tooltip title={"AERC 3 or more – Best"}>
            <div style={props.style}><BestIcon/></div>
        </Tooltip>
    }
    return null
}
