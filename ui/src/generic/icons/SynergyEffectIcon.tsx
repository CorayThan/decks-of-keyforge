import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"
import { AboveAverageIcon } from "./AboveAverageIcon"
import { BelowAverageIcon } from "./BelowAverageIcon"

export const SynergyEffectIcon = (props: { effect: number }) => {
    const quality = props.effect
    let content
    if (quality === 1 || quality === -1) {
        content = <Tooltip title={"Rating 1 – Low Effect"}>
            <div><BelowAverageIcon/></div>
        </Tooltip>
    } else if (quality === 3 || quality === -3) {
        content = <Tooltip title={"Rating 3 – Max Effect"}>
            <div><AboveAverageIcon/></div>
        </Tooltip>
    }
    if (content == null) {
        return null
    }
    return (
        <div style={{marginRight: spacing(1)}}>
            {content}
        </div>
    )
}
