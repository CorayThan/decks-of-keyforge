import { Tooltip } from "@material-ui/core"
import * as React from "react"
import { AboveAverageIcon } from "./AboveAverageIcon"
import { BelowAverageIcon } from "./BelowAverageIcon"

export const SynergyEffectIcon = (props: { effect: number }) => {
    const quality = props.effect
    if (quality === 1 || quality === -1) {
        return <Tooltip title={"Rating 1 – Low Effect"}>
            <div><BelowAverageIcon/></div>
        </Tooltip>
    } else if (quality === 3 || quality === -3) {
        return <Tooltip title={"Rating 3 – Max Effect"}>
            <div><AboveAverageIcon/></div>
        </Tooltip>
    }
    return null
}
