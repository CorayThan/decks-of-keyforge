import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { AboveAverageIcon } from "./AboveAverageIcon"
import { BelowAverageIcon } from "./BelowAverageIcon"
import { WorstIcon } from "./WorstIcon"

export const SynergyEffectIcon = (props: { effect: number }) => {
    const quality = props.effect
    let title
    let Icon
    if (quality === 1 || quality === -1) {
        title = "Rating 1 – Weakest Effect"
        Icon = WorstIcon
    } else if (quality === 2 || quality === -2) {
        title = "Rating 2 – Weakest Effect"
        Icon = BelowAverageIcon
    } else if (quality === 4 || quality === -4) {
        title = "Rating 4 – Weakest Effect"
        Icon = AboveAverageIcon
    } else {
        return null
    }
    return (
        <div style={{marginRight: spacing(1)}}>
            <Tooltip title={title} style={{height: 18}}>
                <div><Icon height={18}/></div>
            </Tooltip>
        </div>
    )
}
