import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { AboveAverageIcon } from "./AboveAverageIcon"
import { AboveAveragePlusIcon } from "./AboveAveragePlusIcon"
import { AverageIcon } from "./AverageIcon"
import { AverageMinusIcon } from "./AverageMinusIcon"
import { AveragePlusIcon } from "./AveragePlusIcon"
import { BelowAverageIcon } from "./BelowAverageIcon"
import { BelowAverageMinusIcon } from "./BelowAverageMinusIcon"
import { BestIcon } from "./BestIcon"
import { WorstIcon } from "./WorstIcon"

export const CardQualityIcon = (props: { quality: number, style?: React.CSSProperties}) => {
    const quality = props.quality
    if (quality === 0) {
        return <Tooltip title={"Card rating 0 – Worst"}><div style={props.style}><WorstIcon/></div></Tooltip>
    } else if (quality === 0.5) {
        return <Tooltip title={"Card rating 0.5 – Below Average Minus"}><div style={props.style}><BelowAverageMinusIcon/></div></Tooltip>
    } else if (quality === 1) {
        return <Tooltip title={"Card rating 1 – Below Average"}><div style={props.style}><BelowAverageIcon/></div></Tooltip>
    } else if (quality === 1.5) {
        return <Tooltip title={"Card rating 1.5 – Average Minus"}><div style={props.style}><AverageMinusIcon/></div></Tooltip>
    } else if (quality === 2) {
        return <Tooltip title={"Card rating 2 – Average"}><div style={props.style}><AverageIcon/></div></Tooltip>
    } else if (quality === 2.5) {
        return <Tooltip title={"Card rating 2.5 – Average Plus"}><div style={props.style}><AveragePlusIcon/></div></Tooltip>
    } else if (quality === 3) {
        return <Tooltip title={"Card rating 3 – Above Average"}><div style={props.style}><AboveAverageIcon/></div></Tooltip>
    } else if (quality === 3.5) {
        return <Tooltip title={"Card rating 3.5 – Above Average Plus"}><div style={props.style}><AboveAveragePlusIcon/></div></Tooltip>
    } else if (quality === 4) {
        return <Tooltip title={"Card rating 4 – Best"}><div style={props.style}><BestIcon/></div></Tooltip>
    }
    return null
}
