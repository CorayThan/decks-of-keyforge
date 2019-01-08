import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { AboveAverageIcon } from "./AboveAverageIcon"
import { AverageIcon } from "./AverageIcon"
import { BelowAverageIcon } from "./BelowAverageIcon"
import { BestIcon } from "./BestIcon"
import { WorstIcon } from "./WorstIcon"

export const CardQualityIcon = (props: { quality: number}) => {
    const quality = props.quality
    if (quality === 1) {
        return <Tooltip title={"Card rating 0 – Worst"}><div><WorstIcon/></div></Tooltip>
    } else if (quality === 2) {
        return <Tooltip title={"Card rating 1 – Below Average"}><div><BelowAverageIcon/></div></Tooltip>
    } else if (quality === 3) {
        return <Tooltip title={"Card rating 2 – Average"}><div><AverageIcon/></div></Tooltip>
    } else if (quality === 4) {
        return <Tooltip title={"Card rating 3 – Above Average"}><div><AboveAverageIcon/></div></Tooltip>
    } else if (quality === 5) {
        return <Tooltip title={"Card rating 4 – Best"}><div><BestIcon/></div></Tooltip>
    }
    return null
}